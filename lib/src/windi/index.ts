/**
 * @description
 * generic config interface for furi lib
 */
export interface Config {
  key: string;
  set: (string | number)[];
}

/**
 * @description
 * cyan is default color so needed, add others as per requirement
 * used in color prop
 */
export const COLORS = ['red', 'green', 'purple', 'indigo', 'cyan', 'amber', 'lime'];

/**
 * @description
 * safelist of background colors used in furi lib
 */
export const BG_COLOR: Config = {
  key: 'bg',
  set: [500, 400, 300, 50, 200, 100].map((el) => COLORS.map((c) => `${c}-${el}`)).flat(),
};

/**
 * @description
 * safelist of hover colors used in furi lib
 */
export const HOVER_BG_COLOR: Config = {
  key: 'hover:bg',
  set: [300, 400].map((r) => COLORS.map((c) => `${c}-${r}`)).flat(),
};

/**
 * @description
 * a helper function to generate safelist from an array of configs
 */
export function generateSafeList(config: Config[]) {
  return config.map((el) => el.set.map((s) => `${el.key}-${s}`));
}

/**
 * @description
 * a safelist preset of some of the color classes, use this or import individual configs
 * and extend
 * @example
 * ```ts
 * import { furiWindiSafelist } from 'furikaeru/windi';
 * 
 * export default defineConfig({
    safelist: [...furiWindiSafelist],
  });
 *
 * ```
 */
export const furiWindiSafelist = generateSafeList([BG_COLOR, HOVER_BG_COLOR]);
