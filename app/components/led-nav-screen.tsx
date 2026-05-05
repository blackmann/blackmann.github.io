import { PixelMatrixRain } from "./pixel-matrix-rain";
import { PixelScreen } from "./pixel-screen";

export function LedNavScreen() {
  return (
    <PixelScreen className="mx-6 mt-6" label="Animated LED navigation screen">
      <PixelMatrixRain />
    </PixelScreen>
  );
}
