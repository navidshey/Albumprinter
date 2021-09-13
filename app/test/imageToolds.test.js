import {
  calulateNewValue,
  fitVertical,
  fitHorizontal,
  fitImage,
} from "./../js/imageTools.js";

describe("image tools", () => {
  it("should calculate new value", () => {
    expect(calulateNewValue("600px", 20)).toEqual("620px");
    expect(calulateNewValue("", 20)).toEqual("20px");
  });

  it("should fit vertically", () => {
    expect(fitVertical(300, 200, 600)).toEqual({ width: 900, height: 600 });
    expect(fitVertical(200, 300, 600)).toEqual({ width: 400, height: 600 });
    expect(fitVertical(900, 600, 300)).toEqual({ width: 450, height: 300 });
    expect(fitVertical(600, 900, 600)).toEqual({ width: 400, height: 600 });
  });

  it("should fit horizontal", () => {
    expect(fitHorizontal(300, 200, 600)).toEqual({ width: 600, height: 400 });
    expect(fitHorizontal(200, 300, 600)).toEqual({ width: 600, height: 900 });
    expect(fitHorizontal(900, 600, 300)).toEqual({ width: 300, height: 200 });
    expect(fitHorizontal(600, 900, 600)).toEqual({ width: 600, height: 900 });
  });

  it("should fit image to canvas", () => {
    expect(fitImage(300, 200, 600, 400)).toEqual({ width: 600, height: 400 });
    expect(fitImage(1200, 800, 600, 400)).toEqual({ width: 600, height: 400 });
  });
});
