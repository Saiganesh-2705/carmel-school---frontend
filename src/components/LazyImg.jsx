import { useEffect, useRef, useState } from 'react';
import sizes from '../config/imageSizes.json';

// Image that fades in once loaded and reserves its space (no layout jump) using the size manifest.
export default function LazyImg({ src, alt = '', className = '', eager = false, ...rest }) {
  const [ok, setOk] = useState(false);
  const ref = useRef(null);
  const dim = sizes[String(src).split('/').pop()];
  useEffect(() => { if (ref.current?.complete && ref.current.naturalWidth) setOk(true); }, [src]);
  return (
    <img
      ref={ref} src={src} alt={alt} width={dim?.[0]} height={dim?.[1]}
      loading={eager ? 'eager' : 'lazy'} decoding="async"
      onLoad={() => setOk(true)} onError={() => setOk(true)}
      className={`transition-opacity duration-700 ${ok ? 'opacity-100' : 'opacity-0'} ${className}`}
      {...rest}
    />
  );
}
