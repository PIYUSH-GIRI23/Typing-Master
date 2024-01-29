// import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "./fullscreen/Navbar/Navbar";
import {router} from "next/navigation";
import Homepagecomponent from "./fullscreen/Homepagecomponent/Homepagecomponent";
export default function Home() {
  return (
    <main>
      <Navbar />
      {/* api call to ./fullscreen/typing */}
      <Homepagecomponent />
    </main>
  );
}

