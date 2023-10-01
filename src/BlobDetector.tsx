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
            <ColorPredicateRangeSlider rtl style="width:75%" />
          </td>
        </tr>
      </table>
    </>
  );
}
