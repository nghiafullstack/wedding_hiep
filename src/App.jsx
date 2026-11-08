import { useRef, useState } from 'react';
import { wedding } from './data/wedding';
import Cover from './components/Cover';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import InviteCard from './components/InviteCard';
import Countdown from './components/Countdown';
import Families from './components/Families';
import FanGallery from './components/FanGallery';
import Events from './components/Events';
import RingGallery from './components/RingGallery';
import Rsvp from './components/Rsvp';
import Gift from './components/Gift';
import Closing from './components/Closing';
import PetalField from './components/PetalField';
import MusicToggle from './components/MusicToggle';

export default function App() {
  const [opened, setOpened] = useState(false);
  const music = useRef(null);

  return (
    <div className="app" style={{ '--accent': wedding.accent }}>
      <Cover
        onOpen={() => {
          setOpened(true);
          music.current?.play();
        }}
      />
      {opened && <PetalField />}
      <main>
        <Hero opened={opened} />
        <Marquee />
        <InviteCard />
        <Countdown />
        <Families />
        <FanGallery />
        <Events />
        <RingGallery />
        <Rsvp />
        <Gift />
      </main>
      <Closing />
      <MusicToggle ref={music} />
    </div>
  );
}
