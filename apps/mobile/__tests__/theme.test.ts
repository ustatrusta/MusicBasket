import { colors } from '../src/theme/tokens';

describe('theme tokens', () => {
  it('includes required dark palette values', () => {
    expect(colors.dark.background).toBe('#121417');
    expect(colors.dark.primaryAccent).toBe('#D6A45B');
  });
});
