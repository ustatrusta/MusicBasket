export const i18nKeys = {
  common: {
    loading: 'common.loading',
    retry: 'common.retry',
    save: 'common.save'
  },
  nav: {
    home: 'nav.home',
    songs: 'nav.songs',
    tuner: 'nav.tuner',
    favorites: 'nav.favorites',
    profile: 'nav.profile'
  }
} as const;

export type I18nKey =
  | (typeof i18nKeys)['common'][keyof (typeof i18nKeys)['common']]
  | (typeof i18nKeys)['nav'][keyof (typeof i18nKeys)['nav']];
