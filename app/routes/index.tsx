import { Link } from "@remix-run/react";
import React from 'react';
import { useOptionalUser } from "~/utils";
import 'bootstrap/dist/css/bootstrap.css';
import styles from './style'
import Hero from 'app/components/Hero';
import Navbar from 'app/components/Navbar';


const Index = () => (
  <div className="bg-primary w-full overflow-hidden">
    <div className={`bg-primary ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Hero />
      </div>
    </div>
  </div>
);

export default Index;