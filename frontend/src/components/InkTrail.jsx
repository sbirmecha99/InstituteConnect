import React, { useEffect } from "react";

const InkTrail = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const inkDrop = document.createElement("div");
      inkDrop.style.position = "absolute";
      inkDrop.style.left = `${e.pageX}px`;
      inkDrop.style.top = `${e.pageY}px`;
      inkDrop.style.width = "8px";
      inkDrop.style.height = "8px";
      inkDrop.style.borderRadius = "50%";
      inkDrop.style.background = "rgba(0, 0, 0, 0.8)";
      inkDrop.style.pointerEvents = "none";
      inkDrop.style.zIndex = 9999;
      inkDrop.style.opacity = "1";
      inkDrop.style.transition = "opacity 2s ease-out";

      document.body.appendChild(inkDrop);

      requestAnimationFrame(() => {
        inkDrop.style.opacity = "0";
      });

      setTimeout(() => {
        inkDrop.remove();
      }, 2000);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return null;
};

export default InkTrail;
