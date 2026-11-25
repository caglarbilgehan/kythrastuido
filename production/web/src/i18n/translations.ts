import { AppLanguage, InstrumentType, MixPresetId, StemCategory } from '../types/studio';

export const SUPPORTED_LANGUAGES: { id: AppLanguage; label: string; nativeLabel: string }[] = [
  { id: 'en', label: 'English', nativeLabel: 'English' },
  { id: 'tr', label: 'Turkish', nativeLabel: 'Türkçe' }
];

const LANGUAGE_STORAGE_KEY = 'kythra_studio_lang';

export function detectInitialLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as AppLanguage | null;
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.id === saved)) {
      return saved;
    }
  } catch {
    // ignore storage access issues
  }

  const navLangs =
    typeof navigator !== 'undefined'
      ? navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language || 'en']
      : ['en'];

  for (const raw of navLangs) {
    const code = (raw || '').toLowerCase().split(/[-_]/)[0];
    if (code === 'tr') return 'tr';
    if (code === 'en') return 'en';
  }

  return 'en';
}

export function persistLanguage(lang: AppLanguage): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

export interface TranslationCatalog {
  header: {
    searchPlaceholder: string;
    clearSearch: string;
    uploadBtnFull: string;
    uploadBtnShort: string;
    uploadTitle: string;
    close: string;
    dropzoneHeadline: string;
    dropzoneSubtext: string;
    chooseFileBtn: string;
    supportedFormats: string;
    uploadLimits: string;
    replaceAudioBtn: string;
    libraryFoundTitle: string;
    recentReadyTitle: string;
    emptySearchHint: string;
    readyBadge: string;
    analyzeBadge: string;
    loadingStudioTitle: string;
    loadingStudioSub: string;
    analyzingAudioFile: string;
    switchToLight: string;
    switchToDark: string;
    uploadingAudio: string;
    preparingHarmonic: string;
    errSongLoad: string;
    errAudioUpload: string;
    localDeviceNotice: string;
    signInBtn: string;
    signUpTab: string;
    signInTab: string;
    myAccountBtn: string;
    emailLabel: string;
    signUpEmailLabel: string;
    usernameLabel: string;
    passwordLabel: string;
    confirmPasswordLabel: string;
    showPasswordTooltip: string;
    hidePasswordTooltip: string;
    passwordMismatchError: string;
    invalidEmailError: string;
    signOutBtn: string;
    favoritesTab: string;
    myUploadsTab: string;
    emptyFavorites: string;
    emptyUploads: string;
    accountSettingsTitle: string;
    newPasswordOptionalLabel: string;
    confirmNewPasswordLabel: string;
    saveProfileBtn: string;
    profileUpdatedMsg: string;
    renameTrackTooltip: string;
    deleteTrackTooltip: string;
    confirmDeleteBtn: string;
    cancelActionBtn: string;
    saveTitleBtn: string;
    trackTitlePlaceholder: string;
  };
  welcome: {
    badge: string;
    title: string;
    subtitle: string;
    singleCardTitle: string;
    singleCardDesc: string;
    singleCardBtn: string;
    recentTitle: string;
  };
  infoStrip: {
    ariaLabel: string;
    barsUnit: string;
    tempoLabel: string;
    keyLabel: string;
    favoriteTooltip: string;
  };
  workspace: {
    sectionFallback: string;
    barLabel: string;
    prevChord: string;
    currentChord: string;
    nextChord: string;
    endChord: string;
    diagramHeaderSuffix: string;
    activeDiagramRole: string;
    nextDiagramRole: string;
    capoBadge: string;
    positionTooltip: (pos: number, fret: number) => string;
    sectionsAria: string;
  };
  karaoke: {
    ariaLabel: string;
    emptyLyrics: string;
    nowBadge: string;
    nextBadge: string;
    vocalCountdown: (timeStr: string) => string;
    seekTooltip: (timeStr: string) => string;
    instrumentalIntro: string;
    editLyricsBtn: string;
    addLyricsBtn: string;
    lockedLrclibBadge: string;
    versionBadge: (ver: number, user?: string | null) => string;
    editorTitle: string;
    sectionSelectLabel: string;
    addLineAtCurrentTime: (timeStr: string) => string;
    addLineToSection: (secName: string) => string;
    stampCurrentTime: string;
    linePlaceholder: string;
    saveLyricsBtn: string;
    cancelBtn: string;
    revisionsTitle: string;
    noRevisionsYet: string;
  };
  docker: {
    ariaLabel: string;
    prevBar: string;
    play: string;
    pause: string;
    nextBar: string;
    loopActive: string;
    loopSectionTooltip: (secName: string) => string;
    loopBarsTooltip: (start: number, end: number) => string;
    loopToggleTooltip: string;
    metronomeActiveTooltip: string;
    metronomeInactiveTooltip: string;
    waveformAria: string;
    instrumentBtnTitle: string;
    speedBtnTitle: string;
    transposeBtnLabel: string;
    transposeBtnTitle: string;
    mixerBtnLabel: string;
    mixerBtnTitle: string;
    masterMuteTitle: string;
    masterUnmuteTitle: string;
    settingsBtnTitle: string;
    popovers: {
      instrumentTitle: string;
      speedTitle: string;
      reset1x: string;
      transposeCapoTitle: string;
      resetBtn: string;
      transposeSemitones: string;
      capoFret: string;
      capoNone: string;
      capoFretValue: (fret: number) => string;
      mixerTitle: (count?: number) => string;
      stage3RunningMsg: string;
      muteTooltip: (ch: string) => string;
      soloTooltip: (ch: string) => string;
      settingsTitle: string;
      languageLabel: string;
      chordVoicingLabel: string;
      chordBasic: string;
      chordAll: string;
      quickMixPresetsLabel: string;
    };
    instruments: Record<InstrumentType, { name: string; tuning: string }>;
    channels: Record<StemCategory, string>;
    presets: Record<MixPresetId, string>;
  };
}

export const TRANSLATIONS: Record<AppLanguage, TranslationCatalog> = {
  en: {
    header: {
      searchPlaceholder: 'Search your library & uploads...',
      clearSearch: 'Clear search',
      uploadBtnFull: 'New Project',
      uploadBtnShort: 'Upload',
      uploadTitle: 'Open Music Studio',
      close: 'Close',
      dropzoneHeadline: 'Drag and drop an audio file here',
      dropzoneSubtext: 'or click to browse from your device',
      chooseFileBtn: 'Choose File',
      supportedFormats: 'Supported Audio Formats',
      uploadLimits: 'Max 100 MB · 10 min',
      replaceAudioBtn: 'Change',
      libraryFoundTitle: 'Matching Songs in Your Library',
      recentReadyTitle: 'Recent & Ready Projects',
      emptySearchHint: 'No saved songs match yet. Upload an audio track to begin.',
      readyBadge: 'Ready',
      analyzeBadge: 'Analyze',
      loadingStudioTitle: 'Preparing song in studio...',
      loadingStudioSub: 'Loading track analysis, please wait...',
      analyzingAudioFile: 'Analyzing audio file...',
      switchToLight: 'Switch to Light Theme',
      switchToDark: 'Switch to Dark Theme',
      uploadingAudio: 'Loading audio file into studio...',
      preparingHarmonic: 'Analyzing tempo, key, structure & chords (Channel separation runs in background)...',
      errSongLoad: 'Could not load song.',
      errAudioUpload: 'Could not upload audio file.',
      localDeviceNotice: 'Note: Uploaded audio files are saved privately in your account storage and cached locally for instant playback.',
      signInBtn: 'Sign In',
      signUpTab: 'Sign Up',
      signInTab: 'Sign In',
      myAccountBtn: 'My Account',
      emailLabel: 'Email Address',
      signUpEmailLabel: 'Email Address',
      usernameLabel: 'Display Name',
      passwordLabel: 'Password',
      confirmPasswordLabel: 'Confirm Password',
      showPasswordTooltip: 'Show password',
      hidePasswordTooltip: 'Hide password',
      passwordMismatchError: 'Passwords do not match.',
      invalidEmailError: 'Please enter a valid email address.',
      signOutBtn: 'Sign Out',
      favoritesTab: 'Favorites',
      myUploadsTab: 'My Uploads',
      emptyFavorites: 'No favorite songs yet. Tap the star icon next to a song title to add it.',
      emptyUploads: 'No private uploaded tracks yet. Uploaded files are visible only to you.',
      accountSettingsTitle: 'Account Settings',
      newPasswordOptionalLabel: 'New Password (optional)',
      confirmNewPasswordLabel: 'Confirm New Password',
      saveProfileBtn: 'Save Changes',
      profileUpdatedMsg: 'Account settings updated successfully.',
      renameTrackTooltip: 'Rename Song',
      deleteTrackTooltip: 'Delete Song',
      confirmDeleteBtn: 'Delete',
      cancelActionBtn: 'Cancel',
      saveTitleBtn: 'Save',
      trackTitlePlaceholder: 'Song title'
    },
    welcome: {
      badge: 'Post-AI Music & Practice Studio',
      title: 'Turn Any Song Into an Interactive Studio',
      subtitle: 'Upload any audio track for automatic BPM, chord, song section detection, and 6-channel AI instrument separation.',
      singleCardTitle: 'Single Track Upload',
      singleCardDesc: 'Upload MP3, WAV, FLAC, OGG, or M4A. Automatically detects BPM, chords, song sections, and splits instruments.',
      singleCardBtn: 'Upload Audio File',
      recentTitle: 'Your Recent Projects'
    },
    infoStrip: {
      ariaLabel: 'Track Metadata',
      barsUnit: 'Bars',
      tempoLabel: 'Tempo:',
      keyLabel: 'Key:',
      favoriteTooltip: 'Toggle Favorite'
    },
    workspace: {
      sectionFallback: 'Section',
      barLabel: 'Bar',
      prevChord: 'Previous',
      currentChord: 'Current Chord',
      nextChord: 'Next',
      endChord: 'End',
      diagramHeaderSuffix: 'Diagram',
      activeDiagramRole: 'Active',
      nextDiagramRole: 'Next',
      capoBadge: 'Capo',
      positionTooltip: (pos, fret) => `Voicing ${pos} (Fret ${fret})`,
      sectionsAria: 'Song Sections'
    },
    karaoke: {
      ariaLabel: 'Synchronized Lyrics',
      emptyLyrics: 'No synchronized lyrics available or instrumental track is playing.',
      nowBadge: 'Now',
      nextBadge: 'Next',
      vocalCountdown: (t) => `Vocals -${t}`,
      seekTooltip: (t) => `Jump to ${t}`,
      instrumentalIntro: '♪ Instrumental Intro ♪',
      editLyricsBtn: 'Edit Lyrics',
      addLyricsBtn: 'Add Lyrics',
      lockedLrclibBadge: 'Verified Synced Lyrics',
      versionBadge: (v, u) => `v${v}${u ? ` · by ${u}` : ''}`,
      editorTitle: 'Section-Based Lyric Studio & Live Sync',
      sectionSelectLabel: 'Song Sections',
      addLineAtCurrentTime: (t) => `+ Add Line at Playhead (${t})`,
      addLineToSection: (s) => `+ Add Line to ${s}`,
      stampCurrentTime: 'Sync to Current Time',
      linePlaceholder: 'Type lyric line...',
      saveLyricsBtn: 'Save Lyrics',
      cancelBtn: 'Close',
      revisionsTitle: 'Revision History',
      noRevisionsYet: 'No revisions recorded yet.'
    },
    docker: {
      ariaLabel: 'Studio Transport & Control Dock',
      prevBar: 'Restart Song',
      play: 'Play (Space)',
      pause: 'Pause (Space)',
      nextBar: 'Next Bar',
      loopActive: 'Loop Active',
      loopSectionTooltip: (sec) => `Loop Active: ${sec}`,
      loopBarsTooltip: (s, e) => `Loop Active: Bar ${s}–${e}`,
      loopToggleTooltip: 'Loop Current Section or Selected Bars',
      metronomeActiveTooltip: 'Metronome On (Click to mute · Volume in Mixer)',
      metronomeInactiveTooltip: 'Turn On Metronome (Adjust volume in Mixer)',
      waveformAria: 'Waveform Timeline Scrubber',
      instrumentBtnTitle: 'Selected Instrument',
      speedBtnTitle: 'Playback Speed',
      transposeBtnLabel: 'Transpose',
      transposeBtnTitle: 'Transpose & Capo',
      mixerBtnLabel: 'Mixer',
      mixerBtnTitle: 'Multi-Track Stem Mixer',
      masterMuteTitle: 'Mute All Audio',
      masterUnmuteTitle: 'Unmute Audio',
      settingsBtnTitle: 'Studio Settings',
      popovers: {
        instrumentTitle: 'Select Instrument',
        speedTitle: 'Playback Speed',
        reset1x: 'Reset 1.0x',
        transposeCapoTitle: 'Transpose & Capo',
        resetBtn: 'Reset',
        transposeSemitones: 'Transpose (Semitones)',
        capoFret: 'Capo Fret (0–12)',
        capoNone: 'None',
        capoFretValue: (f) => `Fret ${f}`,
        mixerTitle: () => 'Studio Mixer',
        stage3RunningMsg: 'Channel separation is running in the background (Master mix playing)...',
        muteTooltip: (ch) => `Mute ${ch}`,
        soloTooltip: (ch) => `Solo ${ch}`,
        settingsTitle: 'Studio Settings',
        languageLabel: 'Language',
        chordVoicingLabel: 'Chord Notation',
        chordBasic: 'Basic (Triads)',
        chordAll: 'Full (7ths / Extensions)',
        quickMixPresetsLabel: 'Quick Mix Presets'
      },
      instruments: {
        guitar: { name: 'Guitar', tuning: '6 Strings · E A D G B e' },
        piano: { name: 'Piano', tuning: '88 Keys · 2-Octave View' },
        ukulele: { name: 'Ukulele', tuning: '4 Strings · G C E A' }
      },
      channels: {
        guitar: 'Guitar',
        vocals: 'Vocals',
        bass: 'Bass',
        drums: 'Drums',
        piano: 'Piano',
        other: 'Other',
        metronome: 'Metronome'
      },
      presets: {
        full: 'Full Mix',
        guitar_backing: 'Guitar Backing',
        guitar_focus: 'Guitar Solo',
        vocal_karaoke: 'Karaoke',
        rhythm_section: 'Rhythm Section'
      }
    }
  },
  tr: {
    header: {
      searchPlaceholder: 'Kütüphanende ve yüklemelerinde ara...',
      clearSearch: 'Aramayı temizle',
      uploadBtnFull: 'Yeni Proje',
      uploadBtnShort: 'Yükle',
      uploadTitle: 'Müzik Stüdyosunu Başlat',
      close: 'Kapat',
      dropzoneHeadline: 'Ses dosyasını buraya sürükleyip bırakın',
      dropzoneSubtext: 'veya cihazınızdan dosya seçmek için tıklayın',
      chooseFileBtn: 'Dosya Seç',
      supportedFormats: 'Desteklenen Ses Formatları',
      uploadLimits: 'Maks. 100 MB · 10 dk',
      replaceAudioBtn: 'Değiştir',
      libraryFoundTitle: 'Kütüphanende Bulunanlar',
      recentReadyTitle: 'Kayıtlı Projelerin & Hazır Şarkılar',
      emptySearchHint: 'Eşleşen kayıtlı şarkı yok. Başlamak için tek bir ses dosyası yükleyin.',
      readyBadge: 'Hazır',
      analyzeBadge: 'Çözümle',
      loadingStudioTitle: 'Şarkı stüdyoya hazırlanıyor...',
      loadingStudioSub: 'Şarkı analizi yükleniyor, lütfen bekleyin...',
      analyzingAudioFile: 'Ses dosyası çözümleniyor...',
      switchToLight: 'Açık Temaya Geç',
      switchToDark: 'Koyu Temaya Geç',
      uploadingAudio: 'Ses dosyası stüdyoya alınıyor...',
      preparingHarmonic: 'Tempo, Ton, Şarkı Bölümleri ve Akorlar hazırlanıyor (Kanal ayrıştırma arka planda başlar)...',
      errSongLoad: 'Şarkı yüklenemedi.',
      errAudioUpload: 'Ses dosyası yüklenemedi.',
      localDeviceNotice: 'Bilgi: Yüklediğiniz ses dosyaları hesabınıza özel olarak kalıcı diskte saklanır ve hızlı oynatma için tarayıcınızda önbelleğe alınır.',
      signInBtn: 'Giriş Yap',
      signUpTab: 'Kayıt Ol',
      signInTab: 'Giriş Yap',
      myAccountBtn: 'Hesabım',
      emailLabel: 'E-posta Adresi',
      signUpEmailLabel: 'E-posta Adresi',
      usernameLabel: 'Görünen Ad',
      passwordLabel: 'Parola',
      confirmPasswordLabel: 'Parolayı Doğrula (Tekrar)',
      showPasswordTooltip: 'Parolayı göster',
      hidePasswordTooltip: 'Parolayı gizle',
      passwordMismatchError: 'Girilen parolalar birbiriyle eşleşmiyor.',
      invalidEmailError: 'Lütfen geçerli bir e-posta adresi girin.',
      signOutBtn: 'Çıkış Yap',
      favoritesTab: 'Favorilerim',
      myUploadsTab: 'Yüklediklerim',
      emptyFavorites: 'Henüz favori şarkınız yok. Şarkı başlığının yanındaki yıldız ikonuna tıklayarak ekleyebilirsiniz.',
      emptyUploads: 'Henüz yüklediğiniz özel bir ses dosyası yok. Yüklediğiniz dosyalar yalnızca size özeldir.',
      accountSettingsTitle: 'Hesap Ayarları',
      newPasswordOptionalLabel: 'Yeni Parola (isteğe bağlı)',
      confirmNewPasswordLabel: 'Yeni Parolayı Doğrula',
      saveProfileBtn: 'Değişiklikleri Kaydet',
      profileUpdatedMsg: 'Hesap bilgileriniz güncellendi.',
      renameTrackTooltip: 'Şarkı Adını Değiştir',
      deleteTrackTooltip: 'Şarkıyı Sil',
      confirmDeleteBtn: 'Sil',
      cancelActionBtn: 'İptal',
      saveTitleBtn: 'Kaydet',
      trackTitlePlaceholder: 'Şarkı adı'
    },
    welcome: {
      badge: 'AI Sonrası Müzik & Pratik Stüdyosu',
      title: 'Kendi Şarkını Etkileşimli Bir Stüdyoya Dönüştür',
      subtitle: 'Tek bir ses dosyası yükleyin; tempo, akorlar, şarkı bölümleri ve 6 kanallı AI enstrüman ayrıştırma otomatik olarak hazırlansın.',
      singleCardTitle: 'Tek Parça Yükle',
      singleCardDesc: 'MP3, WAV, FLAC, OGG veya M4A yükleyin. Tempo, akorlar, şarkı bölümleri ve enstrüman kanalları otomatik çıkarılsın.',
      singleCardBtn: 'Ses Dosyası Yükle',
      recentTitle: 'Son Projelerin'
    },
    infoStrip: {
      ariaLabel: 'Şarkı Bilgileri',
      barsUnit: 'Bar',
      tempoLabel: 'Metronom:',
      keyLabel: 'Ton:',
      favoriteTooltip: 'Favorilere Ekle / Çıkar'
    },
    workspace: {
      sectionFallback: 'Bölüm',
      barLabel: 'Bar',
      prevChord: 'Önceki',
      currentChord: 'Şu Anki Akor',
      nextChord: 'Sıradaki',
      endChord: 'Son',
      diagramHeaderSuffix: 'Diyagramı',
      activeDiagramRole: 'Aktif',
      nextDiagramRole: 'Sıradaki',
      capoBadge: 'Capo',
      positionTooltip: (pos, fret) => `Pozisyon ${pos} (${fret}. Perde)`,
      sectionsAria: 'Şarkı Bölümleri'
    },
    karaoke: {
      ariaLabel: 'Senkronize Şarkı Sözleri',
      emptyLyrics: 'Bu şarkı için senkronize şarkı sözü bulunamadı veya enstrümantal parça çalıyor.',
      nowBadge: 'Şu An',
      nextBadge: 'Sıradaki',
      vocalCountdown: (t) => `Vokal -${t}`,
      seekTooltip: (t) => `${t} konumuna git`,
      instrumentalIntro: '♪ Enstrümantal Giriş (Intro) ♪',
      editLyricsBtn: 'Sözleri Düzenle',
      addLyricsBtn: 'Şarkı Sözü Ekle',
      lockedLrclibBadge: 'Doğrulanmış Senkron Söz',
      versionBadge: (v, u) => `v${v}${u ? ` · ${u}` : ''}`,
      editorTitle: 'Bölüm Bazlı Şarkı Sözü Editörü & Canlı Senkron',
      sectionSelectLabel: 'Şarkı Bölümleri',
      addLineAtCurrentTime: (t) => `+ Çalan Saniyeye Satır Ekle (${t})`,
      addLineToSection: (s) => `+ ${s} Bölümüne Satır Ekle`,
      stampCurrentTime: 'Şu Anki Saniyeye Eşitle',
      linePlaceholder: 'Şarkı sözü satırını yazın...',
      saveLyricsBtn: 'Sözleri Kaydet',
      cancelBtn: 'Kapat',
      revisionsTitle: 'Düzenleme Geçmişi (Log)',
      noRevisionsYet: 'Henüz kullanıcı düzenlemesi kaydı bulunmuyor.'
    },
    docker: {
      ariaLabel: 'Stüdyo Kontrol Merkezi',
      prevBar: 'Şarkının Başına Dön',
      play: 'Oynat (Space)',
      pause: 'Duraklat (Space)',
      nextBar: 'Sonraki Ölçü (Bar)',
      loopActive: 'Loop Aktif',
      loopSectionTooltip: (sec) => `Loop Aktif: ${sec}`,
      loopBarsTooltip: (s, e) => `Loop Aktif: Bar ${s}–${e}`,
      loopToggleTooltip: 'Mevcut Bölümü veya Seçili Barları Döngüye Al (Loop)',
      metronomeActiveTooltip: 'Metronom Açık (Kapatmak için tıklayın · Ses seviyesi Mikser\'de)',
      metronomeInactiveTooltip: 'Metronomu Aç (Ses seviyesi Mikser\'den ayarlanabilir)',
      waveformAria: 'Waveform Zaman Çizelgesi',
      instrumentBtnTitle: 'Seçili Enstrüman',
      speedBtnTitle: 'Çalma Hızı (Tempo)',
      transposeBtnLabel: 'Transpoze',
      transposeBtnTitle: 'Transpoze & Capo',
      mixerBtnLabel: 'Mikser',
      mixerBtnTitle: 'Çok Kanallı Stüdyo Mikseri',
      masterMuteTitle: 'Tüm Sesi Kapat (Sessize Al)',
      masterUnmuteTitle: 'Sesi Aç',
      settingsBtnTitle: 'Stüdyo Ayarları',
      popovers: {
        instrumentTitle: 'Enstrüman Seçimi',
        speedTitle: 'Çalma Hızı',
        reset1x: '1.0x Sıfırla',
        transposeCapoTitle: 'Transpoze & Capo',
        resetBtn: 'Sıfırla',
        transposeSemitones: 'Transpoze (Yarım Ses)',
        capoFret: 'Capo Perdesi (0–12)',
        capoNone: 'Yok',
        capoFretValue: (f) => `${f}. Perde`,
        mixerTitle: () => 'Stüdyo Mikseri',
        stage3RunningMsg: 'Kanal ayrıştırma arka planda sürüyor (Master ses çalıyor)...',
        muteTooltip: (ch) => `${ch} Sustur (Mute)`,
        soloTooltip: (ch) => `${ch} Solo`,
        settingsTitle: 'Stüdyo Ayarları',
        languageLabel: 'Uygulama Dili',
        chordVoicingLabel: 'Akor Gösterimi',
        chordBasic: 'Temel (Basic)',
        chordAll: 'Tam (7\'li / Tüm Akorlar)',
        quickMixPresetsLabel: 'Hızlı Miks Presetleri'
      },
      instruments: {
        guitar: { name: 'Gitar', tuning: '6 Tel · E A D G B e' },
        piano: { name: 'Piyano', tuning: '88 Tuş · 2 Oktav Görünüm' },
        ukulele: { name: 'Ukulele', tuning: '4 Tel · G C E A' }
      },
      channels: {
        guitar: 'Gitar',
        vocals: 'Vokal',
        bass: 'Bas',
        drums: 'Davul',
        piano: 'Piyano',
        other: 'Diğer',
        metronome: 'Metronom'
      },
      presets: {
        full: 'Tam Miks',
        guitar_backing: 'Gitarsız Backing',
        guitar_focus: 'Sadece Gitar',
        vocal_karaoke: 'Karaoke',
        rhythm_section: 'Ritim Grubu'
      }
    }
  }
};
