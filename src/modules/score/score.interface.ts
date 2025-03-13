export abstract class ScoreInterface {
  /**
   * Calculates the cumulative scores for each frame based on the rolls provided.
   * @param rolls - A 2D array where each subarray represents the rolls for a single frame.
   *                Rolls can include:
   *                - '1' to '9': Number of pins knocked down.
   *                - 'x': Strike (all 10 pins knocked down in the first roll of the frame).
   *                - '/': Spare (remaining pins knocked down to make a total of 10 in the frame).
   *                - '.': Zero pins knocked down.
   * @returns An array of cumulative scores for each frame.
   */
  abstract computeFrameScores(rolls: string[][]): number[];
}
