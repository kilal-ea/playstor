import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

// ==================== Ad Keys ====================
const AD_KEYS = {
  banner728x90: { key: 'ef3657a3bc84fdd49514881c7a0f2985', width: 728, height: 90 },
  banner320x50: { key: '213018fc376d1d755d3f369229feeab4', width: 320, height: 50 },
  skyscraper160x600: { key: '60801af66cf43fcef9620485242f6528', width: 160, height: 600 },
  halfPage160x300: { key: 'fc674a6c6593bb82c7a97c6406cc3c02', width: 160, height: 300 },
  banner468x60: { key: '285e8b7fa8cbb5e5ab0567df09ea99c9', width: 468, height: 60 },
  square300x250: { key: '5a455b32731ae8810a4d7a0386eac003', width: 300, height: 250 },
} as const;

// ==================== Ad Component ====================
interface AdProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}

const Ad: React.FC<AdProps> = ({ adKey, width, height, className = '' }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const loaded = React.useRef(false);

  React.useEffect(() => {
    if (loaded.current || !ref.current) return;
    loaded.current = true;

    const container = ref.current;

    (window as any).atOptions = {
      key: adKey,
      format: 'iframe',
      height,
      width,
      params: {},
    };

    const script = document.createElement('script');
    script.src = `https://www.highrevenueformat.com/${adKey}/invoke.js`;
    script.async = true;
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
      loaded.current = false;
    };
  }, [adKey, width, height]);

  return (
    <div
      ref={ref}
      className={`flex justify-center items-center mx-auto overflow-hidden ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
};

// ==================== Page ====================
export const AccessDeniedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-[75vh] flex flex-col items-center justify-center p-4 gap-6">
      {/* ===== إعلان علوي ===== */}
      <div className="w-full flex justify-center">
        <Ad
          adKey={AD_KEYS.banner728x90.key}
          width={AD_KEYS.banner728x90.width}
          height={AD_KEYS.banner728x90.height}
          className="hidden md:flex"
        />
        <Ad
          adKey={AD_KEYS.banner320x50.key}
          width={AD_KEYS.banner320x50.width}
          height={AD_KEYS.banner320x50.height}
          className="flex md:hidden"
        />
      </div>

      {/* ===== البطاقة الرئيسية ===== */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Access Denied
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Please start from the reward page to create a valid reward session.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/playcode')}
            className="w-full py-3.5 px-6 rounded-2xl bg-play-blue-600 hover:bg-play-blue-700 active:scale-[0.98] text-white font-semibold text-base shadow-md shadow-play-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Rewards</span>
          </button>
        </div>
      </div>

      {/* ===== إعلان مربع أسفل البطاقة ===== */}
      <div className="flex justify-center">
        <Ad
          adKey={AD_KEYS.square300x250.key}
          width={AD_KEYS.square300x250.width}
          height={AD_KEYS.square300x250.height}
        />
      </div>

      {/* ===== إعلان سفلي ===== */}
      <div className="w-full flex justify-center">
        <Ad
          adKey={AD_KEYS.banner468x60.key}
          width={AD_KEYS.banner468x60.width}
          height={AD_KEYS.banner468x60.height}
          className="hidden sm:flex"
        />
        <Ad
          adKey={AD_KEYS.banner320x50.key}
          width={AD_KEYS.banner320x50.width}
          height={AD_KEYS.banner320x50.height}
          className="flex sm:hidden"
        />
      </div>
    </main>
  );
};