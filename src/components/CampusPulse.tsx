'use client';
import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, MapPin, Clock, Info } from 'lucide-react';
import styles from './CampusPulse.module.css';

const nostalgiaTips = [
  "Dwarahat was once the capital of the Katyuri Kingdom.",
  "The BTKIT campus is famous for its panoramic view of the Trishul and Nanda Devi peaks.",
  "The legendary 'Patal Devi' temple is within walking distance from campus.",
  "KEC was established in 1991 to bring technical excellence to the hills."
];

export default function CampusPulse() {
  const [mounted, setMounted] = useState(false);
  const [weather, setWeather] = useState<{ temp: number, desc: string } | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [randomTip, setRandomTip] = useState(nostalgiaTips[0]);
  
  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    setRandomTip(nostalgiaTips[Math.floor(Math.random() * nostalgiaTips.length)]);

    // Current time in Dwarahat (IST)
    const timer = setInterval(() => setTime(new Date()), 60000);
    
    // Simple weather fetch (Mocked or lightweight fetch)
    const mockTemp = Math.floor(Math.random() * (22 - 12 + 1)) + 12;
    setWeather({ temp: mockTemp, desc: 'Mist & Clouds' });
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.pulseCard}>
      <div className={styles.header}>
        <div className={styles.location}>
          <MapPin size={14} />
          <span>Dwarahat, Uttarakhand</span>
        </div>
        <div className={styles.timeSection}>
          <Clock size={14} />
          <span suppressHydrationWarning={true}>{mounted && time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST' : '--:-- --'}</span>
        </div>
      </div>

      <div className={styles.weatherHero}>
        <div className={styles.tempSection}>
          <span className={styles.temp} suppressHydrationWarning={true}>{mounted && weather ? weather.temp : '--'}°C</span>
          <span className={styles.desc} suppressHydrationWarning={true}>{mounted && weather ? weather.desc : 'Loading...'}</span>
        </div>
        <div className={styles.weatherIcon}>
          {mounted && weather?.temp && weather.temp < 15 ? <Cloud size={40} /> : <Sun size={40} className={styles.sunIcon} />}
        </div>
      </div>

      <div className={styles.nostalgiaBox}>
        <Info size={16} className={styles.infoIcon} />
        <p suppressHydrationWarning={true}>“{mounted ? randomTip : nostalgiaTips[0]}”</p>
      </div>
    </div>
  );
}
