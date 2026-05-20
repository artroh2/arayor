import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // If there's a hash, scroll to the element with that id
      const element = document.getElementById(hash.slice(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        return;
      }
    }
    // Otherwise scroll to top
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
