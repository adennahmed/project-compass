/**
 * Shared mutable hover targets for the studio portraits. The HTML
 * overlay writes to these; SceneController's render loop reads them
 * and lerps the corresponding shader's uHover uniform.
 */
export const studioHoverTargets: number[] = [0, 0];
