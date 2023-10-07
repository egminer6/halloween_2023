import React from "react";
import ColorPredicateRangeSlider from "./ColorPredicateRangeSlider";

export default function BlobDetector() {
  return (
    <>
      <h2>Blob Detector</h2>

      <h3>Color Predicate</h3>
      <table>
        <tr>
          <td>Red</td>
          <td>
            <div className="color-predicate-range-slider-container">
              <ColorPredicateRangeSlider rtl={false} />
            </div>
          </td>
        </tr>
        <tr>
          <td>Green</td>
          <td>
            <div className="color-predicate-range-slider-container">
              <ColorPredicateRangeSlider rtl={false} />
            </div>
          </td>
        </tr>
        <tr>
          <td>Blue</td>
          <td>
            <div className="color-predicate-range-slider-container">
              <ColorPredicateRangeSlider rtl={false} />
            </div>
          </td>
        </tr>
      </table>
    </>
  );
}
