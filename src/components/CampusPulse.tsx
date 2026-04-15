'use client';
import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, MapPin, Clock, Info } from 'lucide-react';
import styles from './CampusPulse.module.css';

export default function CampusPulse() {
  const [weather, setWeather] = useState<{ temp: number, desc: string } | null>(null);
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    // Current time in Dwarahat (IST)
    const timer = setInterval(() => setTime(new Date()), 60000);
    
    // Simple weather fetch (Mocked or lightweight fetch)
    // In a real app, you'd use a free API like OpenWeatherMap
    // For now, we'll mock a realistic Dwarahat temperature range (12-22°C)
    const mockTemp = Math.floor(Math.random() * (22 - 12 + 1)) + 12;
    setWeather({ temp: mockTemp, desc: 'Mist & Clouds' });
    
    return () => clearInterval(timer);
  }, []);

  const nostalgiaTips = [
    "Dwarahat was once the capital of the Katyuri Kingdom.",
    "The BTKIT campus is famous for its panoramic view of the Trishul and Nanda Devi peaks.",
    "The legendary 'Patal Devi' temple is within walking distance from campus.",
    "KEC was established in 1991 to bring technical excellence to the hills."
  ];

  const randomTip = nostalgiaTips[Math.floor(Math.random() * nostalgiaTips.length)];

  return (
    <div className={styles.pulseCard}>
      <div className={styles.header}>
        <div className={styles.location}>
          <MapPin size={14} />
          <span>Dwarahat, Uttarakhand</span>
        </div>
        <div className={styles.timeSection}>
          <Clock size={14} />
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST</span>
        </div>
      </div>

      <div className={styles.weatherHero}>
        <div className={styles.tempSection}>
          <span className={styles.temp}>{weather?.temp || 18}°C</span>
          <span className={styles.desc}>{weather?.desc || 'Clear Skies'}</span>
        </div>
        <div className={styles.weatherIcon}>
          {weather?.temp && weather.temp < 15 ? <Cloud size={40} /> : <Sun size={40} className={styles.sunIcon} />}
        </div>
      </div>

      <div className={styles.nostalgiaBox}>
        <Info size={16} className={styles.infoIcon} />
        <p>“{randomTip}”</p>
      </div>
    </div>
  );
}
