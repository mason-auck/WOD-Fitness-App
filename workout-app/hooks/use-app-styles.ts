import { useMemo } from "react";

import { createGlobalStyles } from "@/constants/global-styles";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function useAppStyles() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const styles = useMemo(() => createGlobalStyles(colors), [colorScheme]);

  return { colors, styles, colorScheme };
}
