import { useMemo, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Cloudinary } from "@cloudinary/url-gen";
import {
  brightness,
  contrast,
  saturation,
  hue,
  unsharpMask,
  sharpen,
} from "@cloudinary/url-gen/actions/adjust";
import {
  vignette,
  grayscale,
  sepia,
  blur,
  colorize,
  blackwhite,
  redEye,
  negate,
  oilPaint,
  simulateColorBlind,
  pixelate,
  backgroundRemoval,
  generativeRemove,
  generativeRecolor,
  generativeRestore,
  upscale,
  enhance,
  extract,
  generativeReplace,
} from "@cloudinary/url-gen/actions/effect";
import { crop } from "@cloudinary/url-gen/actions/resize";
import { byAngle, mode } from "@cloudinary/url-gen/actions/rotate";
import {
  horizontalFlip,
  verticalFlip,
} from "@cloudinary/url-gen/qualifiers/rotationMode";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { text } from "@cloudinary/url-gen/qualifiers/source";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";
import { Position } from "@cloudinary/url-gen/qualifiers";

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_ClOUD_NAME,
  },
});

// Create a hash function for state objects
const createStateHash = (state: any): string => {
  return JSON.stringify(state);
};

// URL cache to avoid rebuilding identical URLs
const urlCache = new Map<string, string>();

export const useOptimizedCloudinary = () => {
  const imageState = useSelector((state: RootState) => state.image);
  const adjustmentState = useSelector((state: RootState) => state.adjustment);
  const cropState = useSelector((state: RootState) => state.crop);
  const rotationState = useSelector((state: RootState) => state.rotation);
  const filterState = useSelector((state: RootState) => state.filter);
  const overlayState = useSelector((state: RootState) => state.overlay);
  const bgState = useSelector((state: RootState) => state.bg);
  const aiState = useSelector((state: RootState) => state.ai);

  // Cache for the last built URL to avoid unnecessary rebuilds
  const lastUrlRef = useRef<string>("");
  const lastStateHashRef = useRef<string>("");

  // Memoized state hash to detect changes
  const stateHash = useMemo(() => {
    return createStateHash({
      publicId: imageState.publicId,
      adjustment: adjustmentState,
      crop: cropState,
      rotation: rotationState,
      filter: filterState,
      overlay: overlayState,
      bg: bgState,
      ai: aiState,
    });
  }, [
    imageState.publicId,
    adjustmentState,
    cropState,
    rotationState,
    filterState,
    overlayState,
    bgState,
    aiState,
  ]);

  // Optimized URL builder with caching
  const buildTransformedUrl = useCallback(() => {
    if (!imageState.publicId) return null;

    // Check if state hasn't changed
    if (stateHash === lastStateHashRef.current && lastUrlRef.current) {
      return lastUrlRef.current;
    }

    // Check cache first
    const cachedUrl = urlCache.get(stateHash);
    if (cachedUrl) {
      lastUrlRef.current = cachedUrl;
      lastStateHashRef.current = stateHash;
      return cachedUrl;
    }

    // Build new URL
    const myImage = cld.image(imageState.publicId);

    // Apply adjustments (only if values are not default)
    if (adjustmentState.brightness !== 0) {
      myImage.adjust(brightness(adjustmentState.brightness));
    }
    if (adjustmentState.contrast !== 0) {
      myImage.adjust(contrast(adjustmentState.contrast));
    }
    if (adjustmentState.saturation !== 0) {
      myImage.adjust(saturation(adjustmentState.saturation));
    }
    if (adjustmentState.hue !== 0) {
      myImage.adjust(hue(adjustmentState.hue));
    }
    if (adjustmentState.sharpness !== 0) {
      myImage.effect(sharpen(adjustmentState.sharpness));
    }
    if (adjustmentState.unsharpMask !== 0) {
      myImage.adjust(unsharpMask(adjustmentState.unsharpMask));
    }
    if (adjustmentState.vignette !== 0) {
      myImage.effect(vignette(adjustmentState.vignette));
    }
    if (adjustmentState.ambiance > 0) {
      myImage.adjust(saturation().level(adjustmentState.ambiance));
      myImage.adjust(brightness().level(adjustmentState.ambiance));
    } else if (adjustmentState.ambiance < 0) {
      myImage.adjust(saturation().level(adjustmentState.ambiance));
      myImage.adjust(brightness().level(adjustmentState.ambiance));
    }
    if (adjustmentState.highlight !== 0) {
      myImage.effect(brightness(adjustmentState.highlight));
      myImage.effect(contrast(adjustmentState.highlight));
    }

    // Apply rotation
    if (rotationState.angle !== 0) {
      myImage.rotate(byAngle(rotationState.angle));
    }
    if (rotationState.flipHorizontal) {
      myImage.rotate(mode(horizontalFlip()));
    }
    if (rotationState.flipVertical) {
      myImage.rotate(mode(verticalFlip()));
    }

    // Apply crop
    if (
      cropState.active &&
      cropState.width > 0 &&
      cropState.height > 0 &&
      cropState.position
    ) {
      let gravity: string;
      switch (cropState.position) {
        case "top":
          gravity = "north";
          break;
        case "center":
          gravity = "center";
          break;
        case "bottom":
          gravity = "south";
          break;
        default:
          gravity = "center";
      }

      myImage.resize(
        crop()
          .width(cropState.width)
          .height(cropState.height)
          .x(cropState.x)
          .y(cropState.y)
          .gravity(gravity)
      );
    }

    // Apply filters
    if (filterState.grayscale) {
      myImage.effect(grayscale());
    }
    if (filterState.sepia) {
      myImage.effect(sepia());
    }
    if (filterState.blur > 0) {
      myImage.effect(blur(filterState.blur));
    }
    if (filterState.vignette) {
      myImage.effect(vignette());
    }
    if (filterState.colorize !== 0) {
      myImage.effect(colorize(filterState.colorize));
    }
    if (filterState.blackAndWhite) {
      myImage.effect(blackwhite());
    }
    if (filterState.redEye) {
      myImage.effect(redEye());
    }
    if (filterState.negate) {
      myImage.effect(negate());
    }
    if (filterState.oilPaint > 0) {
      myImage.effect(oilPaint(filterState.oilPaint));
    }
    if (filterState.simulateColorBlind !== "none") {
      myImage.effect(
        simulateColorBlind().condition(filterState.simulateColorBlind)
      );
    }
    if (filterState.pixelate > 0) {
      myImage.effect(pixelate(filterState.pixelate));
    }

    // Apply text overlays
    overlayState.textOverlays.forEach((overlay) => {
      myImage.overlay(
        source(
          text(
            overlay.text,
            new TextStyle(overlay.fontFamily, overlay.fontSize)
          ).textColor(overlay.color)
        ).position(new Position().offsetX(overlay.x).offsetY(overlay.y))
      );
    });

    // Apply background effects
    if (bgState.backgroundRemoval.enabled) {
      myImage.effect(backgroundRemoval());
    }

    if (bgState.generativeRemove.enabled && bgState.generativeRemove.prompt) {
      myImage.effect(
        generativeRemove().prompt(bgState.generativeRemove.prompt)
      );
    }

    if (
      bgState.generativeReplace.enabled &&
      bgState.generativeReplace.from &&
      bgState.generativeReplace.to
    ) {
      myImage.effect(generativeReplace().from(bgState.generativeReplace.from).to(bgState.generativeReplace.to));
    }

    // Apply AI effects
    if (aiState.generativeRecolor.enabled && aiState.generativeRecolor.prompt) {
      const recolorEffect = generativeRecolor(
        aiState.generativeRecolor.prompt,
        aiState.generativeRecolor.color
      );
      if (aiState.generativeRecolor.detectMultiple) {
        recolorEffect.detectMultiple();
      }
      myImage.effect(recolorEffect);
    }

    if (aiState.generativeRestore.enabled) {
      myImage.effect(generativeRestore());
    }

    if (aiState.upscale.enabled) {
      myImage.effect(upscale());
    }

    if (aiState.enhance.enabled) {
      myImage.effect(enhance());
    }

    if (aiState.extract.enabled && aiState.extract.prompt) {
      myImage.effect(
        extract(aiState.extract.prompt).mode(aiState.extract.mode)
      );
    }

    const newUrl = myImage.toURL();

    // Cache the result
    urlCache.set(stateHash, newUrl);

    // Keep cache size reasonable (max 100 entries)
    if (urlCache.size > 100) {
      const firstKey = urlCache.keys().next().value;
      if (firstKey !== undefined) {
        urlCache.delete(firstKey);
      }
    }

    lastUrlRef.current = newUrl;
    lastStateHashRef.current = stateHash;

    return newUrl;
  }, [stateHash, imageState.publicId]);

  return {
    buildTransformedUrl,
    clearCache: () => {
      urlCache.clear();
      lastUrlRef.current = "";
      lastStateHashRef.current = "";
    },
  };
};
