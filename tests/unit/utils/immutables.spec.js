import { ImmutableArray } from "@/utils/immutables";

describe("Test Immutable array", () => {
  it("should expose array.map function", function() {
    const array = [0, 1];
    const immutable = ImmutableArray(array);
    expect([1, 2]).toEqual(immutable.map(x => x + 1).toArray());
  });

  it("should be chainable", function() {
    const array = [0, 1];
    const immutable = ImmutableArray(array)
      .map(x => x)
      .extract(0)
      .toArray();
    expect(immutable).toEqual([1]);
  });

  it("should be immutable on extract", function() {
    const array = [0, 1];
    ImmutableArray(array).extract(0);
    expect(array).toEqual([0, 1]);
  });

  [
    [
      [0, 1, 2],
      [1, 2]
    ],
    [
      [0, 1, 2],
      [0, 2]
    ],
    [
      [0, 1, 2],
      [0, 1]
    ]
  ].forEach(([array, expected], index) => {
    it("should extract any existing indices", function() {
      const immutable = ImmutableArray(array)
        .extract(index)
        .toArray();
      expect(immutable).toEqual(expected);
    });
  });
});
