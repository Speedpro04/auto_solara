import React from 'react';

const cache: Record<string, React.ForwardRefExoticComponent<any>> = {};

export const motion = new Proxy({}, {
  get: (_, tag) => {
    const tagName = tag as string;
    if (!cache[tagName]) {
      cache[tagName] = React.forwardRef((props: any, ref) => {
        const { 
          initial, animate, exit, variants, transition, 
          whileHover, whileTap, whileInView, viewport, 
          layoutId, layout, onAnimationComplete,
          ...rest 
        } = props;
        
        return React.createElement(tagName, { ...rest, ref });
      });
    }
    return cache[tagName];
  }
});

export const AnimatePresence = ({ children }: any) => React.createElement(React.Fragment, null, children);
export const useAnimation = () => ({ start: () => {}, stop: () => {} });
export const useIsPresent = () => true;
export const useScroll = () => ({ scrollYProgress: { get: () => 0, onChange: () => () => {} } });
export const useTransform = () => ({ get: () => 0, onChange: () => () => {} });
export const useSpring = () => ({ get: () => 0, onChange: () => () => {} });
export const useInView = () => true;
export const useViewportScroll = () => ({ scrollYProgress: { get: () => 0, onChange: () => () => {} } });
