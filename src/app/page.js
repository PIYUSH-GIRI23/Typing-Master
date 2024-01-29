// import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "./fullscreen/Navbar/navbar";
import {router} from "next/navigation";
import Homepagecomponent from "./fullscreen/Homepagecomponent/homepagecomponent";
export default function Home() {
  return (
    <main>
      <Navbar />
      {/* api call to ./fullscreen/typing */}
      <Homepagecomponent />
    </main>
  );
}

