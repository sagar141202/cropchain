"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, X, ChevronRight, Sprout, AlertTriangle } from "lucide-react";

const STATE_COORDS: Record<string, { lat: number; lon: number; label: string }> = {
  andhra_pradesh:     { lat: 15.9129, lon: 79.7400, label: "Andhra Pradesh"  },
  arunachal_pradesh:  { lat: 28.2180, lon: 94.7278, label: "Arunachal Pradesh"},
  assam:              { lat: 26.2006, lon: 92.9376, label: "Assam"            },
  bihar:              { lat: 25.0961, lon: 85.3131, label: "Bihar"            },
  chhattisgarh:       { lat: 21.2787, lon: 81.8661, label: "Chhattisgarh"    },
  goa:                { lat: 15.2993, lon: 74.1240, label: "Goa"              },
  gujarat:            { lat: 22.2587, lon: 71.1924, label: "Gujarat"          },
  haryana:            { lat: 29.0588, lon: 76.0856, label: "Haryana"          },
  himachal_pradesh:   { lat: 31.1048, lon: 77.1734, label: "Himachal Pradesh" },
  jharkhand:          { lat: 23.6102, lon: 85.2799, label: "Jharkhand"        },
  karnataka:          { lat: 15.3173, lon: 75.7139, label: "Karnataka"        },
  kerala:             { lat: 10.8505, lon: 76.2711, label: "Kerala"           },
  madhya_pradesh:     { lat: 22.9734, lon: 78.6569, label: "Madhya Pradesh"   },
  maharashtra:        { lat: 19.7515, lon: 75.7139, label: "Maharashtra"      },
  manipur:            { lat: 24.6637, lon: 93.9063, label: "Manipur"          },
  meghalaya:          { lat: 25.4670, lon: 91.3662, label: "Meghalaya"        },
  mizoram:            { lat: 23.1645, lon: 92.9376, label: "Mizoram"          },
  nagaland:           { lat: 26.1584, lon: 94.5624, label: "Nagaland"         },
  odisha:             { lat: 20.9517, lon: 85.0985, label: "Odisha"           },
  punjab:             { lat: 31.1471, lon: 75.3412, label: "Punjab"           },
  rajasthan:          { lat: 27.0238, lon: 74.2179, label: "Rajasthan"        },
  sikkim:             { lat: 27.5330, lon: 88.5122, label: "Sikkim"           },
  tamil_nadu:         { lat: 11.1271, lon: 78.6569, label: "Tamil Nadu"       },
  telangana:          { lat: 18.1124, lon: 79.0193, label: "Telangana"        },
  tripura:            { lat: 23.9408, lon: 91.9882, label: "Tripura"          },
  uttar_pradesh:      { lat: 26.8467, lon: 80.9462, label: "Uttar Pradesh"    },
  uttarakhand:        { lat: 30.0668, lon: 79.0193, label: "Uttarakhand"      },
  west_bengal:        { lat: 22.9868, lon: 87.8550, label: "West Bengal"      },
};

const WMO_ICONS: Record<number, { label: string; icon: "sun" | "cloud" | "rain" | "wind" }> = {
  0:  { label: "Clear sky",       icon: "sun"   },
  1:  { label: "Mainly clear",    icon: "sun"   },
  2:  { label: "Partly cloudy",   icon: "cloud" },
  3:  { label: "Overcast",        icon: "cloud" },
  45: { label: "Foggy",           icon: "cloud" },
  48: { label: "Icy fog",         icon: "cloud" },
  51: { label: "Light drizzle",   icon: "rain"  },
  53: { label: "Drizzle",         icon: "rain"  },
  55: { label: "Heavy drizzle",   icon: "rain"  },
  61: { label: "Light rain",      icon: "rain"  },
  63: { label: "Rain",            icon: "rain"  },
  65: { label: "Heavy rain",      icon: "rain"  },
  71: { label: "Light snow",      icon: "wind"  },
  73: { label: "Snow",            icon: "wind"  },
  75: { label: "Heavy snow",      icon: "wind"  },
  80: { label: "Rain showers",    icon: "rain"  },
  81: { label: "Showers",         icon: "rain"  },
  82: { label: "Heavy showers",   icon: "rain"  },
  95: { label: "Thunderstorm",    icon: "rain"  },
  99: { label: "Heavy storm",     icon: "rain"  },
};

function getSowingAdvice(temp: number, rain: number, humidity: number, code: number): {
  text: string; good: boolean; icon: "sow" | "warn";
} {
  if (code >= 95)  return { text: "Thunderstorm — stay indoors, avoid all fieldwork",      good: false, icon: "warn" };
  if (code >= 61)  return { text: "Heavy rain — skip irrigation, waterlogging risk",         good: false, icon: "warn" };
  if (temp > 40)   return { text: "Extreme heat — water crops early morning only",           good: false, icon: "warn" };
  if (temp < 8)    return { text: "Too cold for sowing — protect seedlings overnight",       good: false, icon: "warn" };
  if (humidity > 85 && code >= 51) return { text: "High humidity + drizzle — fungal risk, avoid spraying", good: false, icon: "warn" };
  if (temp >= 18 && temp <= 30 && rain < 5 && code < 61)
                   return { text: "Great day to sow — ideal temperature and dry conditions", good: true,  icon: "sow"  };
  if (rain < 3)    return { text: "Good conditions — light irrigation recommended today",    good: true,  icon: "sow"  };
  return           { text: "Moderate conditions — monitor soil moisture before irrigating",  good: false, icon: "warn" };
}

function WeatherIcon({ type, size = 16 }: { type: string; size?: number }) {
  const props = { style: { width: size, height: size } };
  if (type === "sun")   return <Sun   {...props} />;
  if (type === "rain")  return <CloudRain {...props} />;
  if (type === "wind")  return <Wind  {...props} />;
  return <Cloud {...props} />;
}

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

interface WeatherData {
  temp: number;
  humidity: number;
  rain: number;
  windspeed: number;
  code: number;
  forecast: { date: string; day: string; maxTemp: number; minTemp: number; rain: number; code: number }[];
}

export default function WeatherWidget({ state }: { state: string }) {
  const [weather, setWeather]   = useState<WeatherData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [expanded, setExpanded] = useState(false);

  const coords = STATE_COORDS[state] || STATE_COORDS["maharashtra"];

  useEffect(() => {
    const cacheKey = `weather_${state}`;
    const cached   = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, ts } = JSON.parse(cached);
      // Cache for 30 minutes
      if (Date.now() - ts < 30 * 60 * 1000) { setWeather(data); setLoading(false); return; }
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}`
      + `&current=temperature_2m,relative_humidity_2m,precipitation,windspeed_10m,weathercode`
      + `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum`
      + `&timezone=Asia%2FKolkata&forecast_days=7`;

    fetch(url)
      .then(r => r.json())
      .then(d => {
        const c = d.current;
        const daily = d.daily;
        const data: WeatherData = {
          temp:      Math.round(c.temperature_2m),
          humidity:  c.relative_humidity_2m,
          rain:      c.precipitation,
          windspeed: Math.round(c.windspeed_10m),
          code:      c.weathercode,
          forecast:  daily.time.map((date: string, i: number) => ({
            date,
            day:     DAYS[new Date(date).getDay()],
            maxTemp: Math.round(daily.temperature_2m_max[i]),
            minTemp: Math.round(daily.temperature_2m_min[i]),
            rain:    daily.precipitation_sum[i],
            code:    daily.weathercode[i],
          })),
        };
        setWeather(data);
        localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() }));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [state]);

  const advice = weather
    ? getSowingAdvice(weather.temp, weather.rain, weather.humidity, weather.code)
    : null;

  const wmo = weather ? (WMO_ICONS[weather.code] || WMO_ICONS[0]) : null;

  if (loading) return (
    <div className="glass rounded-2xl p-4 mb-4 animate-pulse flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl" style={{ background: "var(--glass2)" }} />
      <div className="flex-1 space-y-2">
        <div className="h-3 rounded-lg" style={{ background: "var(--glass2)", width: "50%" }} />
        <div className="h-3 rounded-lg" style={{ background: "var(--glass2)", width: "70%" }} />
      </div>
    </div>
  );

  if (error || !weather) return null;

  return (
    <>
      {/* Compact widget */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        onClick={() => setExpanded(true)}
        className="glass rounded-2xl p-4 mb-4 cursor-pointer hover:shadow-lg transition-all"
        style={{ border: "1px solid var(--glass-border)" }}>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: wmo?.icon === "sun" ? "#fef9c3" : wmo?.icon === "rain" ? "#dbeafe" : "#f1f5f9" }}>
              <WeatherIcon type={wmo?.icon || "cloud"}
                size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--text-1)" }}>
                {coords.label} · {wmo?.label}
              </p>
              <p className="text-xs" style={{ color: "var(--text-3)" }}>Tap for 7-day forecast</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="display text-2xl font-bold" style={{ color: "var(--text-1)" }}>
              {weather.temp}°C
            </span>
            <ChevronRight className="w-4 h-4" style={{ color: "var(--text-3)" }} />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mb-3">
          {[
            { icon: Droplets,    val: `${weather.humidity}%`,       label: "Humidity"  },
            { icon: CloudRain,   val: `${weather.rain}mm`,           label: "Rain"      },
            { icon: Wind,        val: `${weather.windspeed} km/h`,   label: "Wind"      },
            { icon: Thermometer, val: `${weather.temp}°`,            label: "Feels"     },
          ].map(s => (
            <div key={s.label} className="flex-1 rounded-xl p-2 text-center"
              style={{ background: "var(--glass2)" }}>
              <s.icon className="w-3 h-3 mx-auto mb-1" style={{ color: "var(--text-3)" }} />
              <p className="text-xs font-bold" style={{ color: "var(--text-1)" }}>{s.val}</p>
              <p style={{ fontSize: 9, color: "var(--text-3)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Advice banner */}
        <div className="rounded-xl px-3 py-2 flex items-center gap-2"
          style={{
            background: advice?.good ? "#dcfce7" : "#fef3c7",
            border: `1px solid ${advice?.good ? "#86efac" : "#fde68a"}`,
          }}>
          {advice?.good
            ? <Sprout className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#16a34a" }} />
            : <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#d97706" }} />}
          <p className="text-xs font-medium leading-tight"
            style={{ color: advice?.good ? "#14532d" : "#78350f" }}>
            {advice?.text}
          </p>
        </div>
      </motion.div>

      {/* 7-day forecast modal */}
      <AnimatePresence>
        {expanded && (
          <div className="modal-overlay" onClick={() => setExpanded(false)}>
            <motion.div
              className="modal-sheet glass"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: 40, scale: 0.95  }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onClick={e => e.stopPropagation()}>

              <div className="p-6">
                {/* Modal header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="display text-xl font-bold" style={{ color: "var(--text-1)" }}>
                      7-Day Forecast
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                      {coords.label} · Updated now
                    </p>
                  </div>
                  <button onClick={() => setExpanded(false)}
                    className="btn-ghost w-8 h-8 !p-0 rounded-xl flex items-center justify-center">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Today's big card */}
                <div className="rounded-2xl p-5 mb-4 text-white"
                  style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs opacity-70 mb-0.5">Today</p>
                      <p className="display text-5xl font-bold">{weather.temp}°C</p>
                      <p className="text-sm opacity-80 mt-1">{wmo?.label}</p>
                    </div>
                    <WeatherIcon type={wmo?.icon || "cloud"} size={56} />
                  </div>
                  <div className="flex gap-4 text-xs opacity-80">
                    <span>💧 {weather.humidity}% humidity</span>
                    <span>🌧 {weather.rain}mm rain</span>
                    <span>💨 {weather.windspeed} km/h</span>
                  </div>
                </div>

                {/* Advice card */}
                <div className="rounded-2xl px-4 py-3 mb-5 flex items-start gap-3"
                  style={{
                    background: advice?.good ? "#dcfce7" : "#fef3c7",
                    border: `1px solid ${advice?.good ? "#86efac" : "#fde68a"}`,
                  }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: advice?.good ? "#bbf7d0" : "#fde68a" }}>
                    {advice?.good
                      ? <Sprout className="w-4 h-4" style={{ color: "#15803d" }} />
                      : <AlertTriangle className="w-4 h-4" style={{ color: "#b45309" }} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-0.5"
                      style={{ color: advice?.good ? "#14532d" : "#78350f" }}>
                      {advice?.good ? "Great farming conditions" : "Caution advised"}
                    </p>
                    <p className="text-xs leading-relaxed"
                      style={{ color: advice?.good ? "#166534" : "#92400e" }}>
                      {advice?.text}
                    </p>
                  </div>
                </div>

                {/* 7-day grid */}
                <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: "var(--text-3)" }}>Next 7 Days</p>
                <div className="space-y-2">
                  {weather.forecast.map((f, i) => {
                    const fw = WMO_ICONS[f.code] || WMO_ICONS[0];
                    const isToday = i === 0;
                    return (
                      <div key={f.date}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all"
                        style={{
                          background: isToday ? "var(--glass2)" : "transparent",
                          border: isToday ? "1px solid var(--glass-border)" : "1px solid transparent",
                        }}>
                        <p className="text-xs font-semibold w-8 flex-shrink-0"
                          style={{ color: isToday ? "var(--green-dark)" : "var(--text-2)" }}>
                          {isToday ? "Today" : f.day}
                        </p>
                        <WeatherIcon type={fw.icon} size={15} />
                        <p className="text-xs flex-1" style={{ color: "var(--text-3)" }}>{fw.label}</p>
                        {f.rain > 0.5 && (
                          <span className="text-xs px-1.5 py-0.5 rounded-lg"
                            style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 10 }}>
                            {f.rain.toFixed(1)}mm
                          </span>
                        )}
                        <p className="text-xs font-semibold w-16 text-right"
                          style={{ color: "var(--text-1)" }}>
                          {f.maxTemp}° <span style={{ color: "var(--text-3)", fontWeight: 400 }}>{f.minTemp}°</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
