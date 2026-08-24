'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from 'framer-motion';
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  isValidElement,
} from 'react';
import { cn } from '@/lib/utils';

const DOCK_HEIGHT = 100;
const DEFAULT_MAGNIFICATION = 68;
const DEFAULT_DISTANCE = 130;
const DEFAULT_PANEL_HEIGHT = 56;

type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
};

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};

type DocContextType = {
  mouseX: MotionValue;
  spring: SpringOptions;
  magnification: number;
  distance: number;
};

type DockProviderProps = {
  children: React.ReactNode;
  value: DocContextType;
};

const DockContext = createContext<DocContextType | undefined>(undefined);

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within a DockProvider');
  }
  return context;
}

function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 280, damping: 18 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + 12);
  }, [magnification]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{
        height: height,
        scrollbarWidth: 'none',
      }}
      className="mx-2 flex max-w-full items-end overflow-x-auto select-none"
    >
      <motion.div
        onMouseMove={(e) => {
          isHovered.set(1);
          mouseX.set(e.pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={cn(
          'mx-auto flex w-fit items-center gap-3 rounded-2xl bg-white/95 px-3 border border-[#1F6D4D]/20 shadow-[0_12px_40px_rgba(0,104,55,0.12)] backdrop-blur-xl dark:bg-[#0E291D]/95 dark:border-[#7EC9A0]/30 dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]',
          className
        )}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        <DockProvider value={{ mouseX, spring, distance, magnification }}>
          {children}
        </DockProvider>
      </motion.div>
    </motion.div>
  );
}

function DockItem({ children, className, onClick }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { distance, magnification, mouseX, spring } = useDock();
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    if (val === Infinity || !ref.current) return distance;
    const domRect = ref.current.getBoundingClientRect();
    return val - (domRect.left + domRect.width / 2);
  });

  const widthTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [40, magnification, 40]
  );

  const width = useSpring(widthTransform, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center cursor-pointer select-none will-change-transform',
        className
      )}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child as React.ReactElement<any>, { width, isHovered })
          : child
      )}
    </motion.div>
  );
}

function DockLabel({ children, className, ...rest }: DockLabelProps) {
  const restProps = rest as Record<string, unknown>;
  const isHovered = restProps['isHovered'] as MotionValue<number>;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered?.on('change', (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe?.();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.95 }}
          animate={{ opacity: 1, y: -12, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.95 }}
          transition={{ duration: 0.12 }}
          className={cn(
            'absolute -top-7 left-1/2 w-fit whitespace-pre rounded-lg border border-gray-200 bg-gray-900/90 px-2.5 py-1 text-[11px] font-bold text-white shadow-md dark:border-neutral-800 backdrop-blur-xs pointer-events-none',
            className
          )}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, ...rest }: DockIconProps) {
  const restProps = rest as Record<string, unknown>;
  const width = restProps['width'] as MotionValue<number>;

  const widthTransform = useTransform(width, (val) => (val ? val / 2 : 20));

  return (
    <motion.div
      style={{ width: widthTransform, height: widthTransform }}
      className={cn('flex items-center justify-center pointer-events-none', className)}
    >
      {children}
    </motion.div>
  );
}

export { Dock, DockIcon, DockItem, DockLabel };
