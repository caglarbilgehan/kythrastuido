import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchLibrarySongs,
  loadCachedSongByTrackKey,
  loginStudioUser,
  logoutStudioUser,
  registerStudioUser,
  updateUserProfile
} from '../api/studioApi';
import {
  AppLanguage,
  FavoriteSongItem,
  LibrarySongItem,
  PrivateUploadedSongItem,
  StudioSong,
  StudioUser
} from '../types/studio';
import { TRANSLATIONS } from '../i18n/translations';
import { formatDurationSec, transposeKeySignature } from '../utils/musicTheory';
import { BrandLogoIcon } from './icons/BrandLogoIcon';
import { SourceOriginIcon, detectSongSource } from './icons/sources/SourceOriginIcon';

interface StudioHeaderProps {
  language: AppLanguage;
  isDarkMode: boolean;
  user: StudioUser | null;
  favorites: FavoriteSongItem[];
  privateUploads: PrivateUploadedSongItem[];
  isAccountCardOpen: boolean;
  isUploadDialogOpen: boolean;
  onSetAccountCardOpen: (open: boolean) => void;
  onOpenUploadDialog: () => void;
  onToggleDarkMode: () => void;
  onSongLoaded: (song: StudioSong) => void;
  onRenameTrack?: (trackKey: string, newTitle: string) => Promise<void>;
  onDeleteTrack?: (trackKey: string) => Promise<void>;
  onAuthChanged: () => void;
}

function parseSongTitleAndArtist(rawTitle: string): { title: string; artist: string } {
  const parts = rawTitle.split(/\s+[-—–]\s+/);
  if (parts.length >= 2) {
    return {
      artist: parts[0].trim(),
      title: parts.slice(1).join(' - ').trim()
    };
  }
  return { artist: '', title: rawTitle.trim() };
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  language,
  isDarkMode,
  user,
  favorites,
  privateUploads,
  isAccountCardOpen,
  isUploadDialogOpen,
  onSetAccountCardOpen,
  onOpenUploadDialog,
  onToggleDarkMode,
  onSongLoaded,
  onRenameTrack,
  onDeleteTrack,
  onAuthChanged
}) => {
  const t = TRANSLATIONS[language].header;

  const [query, setQuery] = useState('');
  const [isOmniboxOpen, setIsOmniboxOpen] = useState(false);
  const [librarySongs, setLibrarySongs] = useState<LibrarySongItem[]>([]);
  const [isLoadingSong, setIsLoadingSong] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingTrackKey, setEditingTrackKey] = useState<string | null>(null);
  const [editingTrackTitle, setEditingTrackTitle] = useState('');
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);
  const [mutatingTrackKey, setMutatingTrackKey] = useState<string | null>(null);

  // Account & Auth card states
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [accountSectionTab, setAccountSectionTab] = useState<'favorites' | 'uploads'>('favorites');
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  // Account profile settings form state
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState('');
  const [profileEmailInput, setProfileEmailInput] = useState('');
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [showProfilePassword, setShowProfilePassword] = useState(false);
  const [showProfileConfirmPassword, setShowProfileConfirmPassword] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);

  const omniboxRef = useRef<HTMLDivElement>(null);
  const accountWrapRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLibrarySongs().then(setLibrarySongs);
  }, [privateUploads.length]);

  useEffect(() => {
    if (!isOmniboxOpen) return;
    fetchLibrarySongs().then(setLibrarySongs);
  }, [isOmniboxOpen]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (omniboxRef.current && !omniboxRef.current.contains(e.target as Node)) {
        if (!isLoadingSong) setIsOmniboxOpen(false);
      }
      if (accountWrapRef.current && !accountWrapRef.current.contains(e.target as Node)) {
        if (!isLoadingSong) onSetAccountCardOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isLoadingSong, onSetAccountCardOpen]);

  // Unified library + private uploads filter (strictly local/user-owned library)
  const filteredLibrary = useMemo(() => {
    const map = new Map<string, LibrarySongItem>();
    privateUploads.forEach((up) => {
      map.set(up.track_key, { ...up, is_current_version: true });
    });
    librarySongs.forEach((item) => {
      if (!map.has(item.track_key)) {
        map.set(item.track_key, item);
      }
    });
    const merged = Array.from(map.values());
    const q = query.trim().toLowerCase();
    if (!q) return merged;
    return merged.filter((item) => item.title.toLowerCase().includes(q));
  }, [librarySongs, privateUploads, query]);

  const handleSelectCachedTrackKey = async (trackKey: string) => {
    setIsLoadingSong(true);
    setLoadingMessage(t.loadingStudioTitle);
    setErrorMessage(null);
    try {
      const loaded = await loadCachedSongByTrackKey(trackKey);
      onSongLoaded(loaded);
      setIsOmniboxOpen(false);
      onSetAccountCardOpen(false);
      setQuery('');
    } catch (err: any) {
      setErrorMessage(err?.message || t.errSongLoad);
    } finally {
      setIsLoadingSong(false);
      setLoadingMessage('');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (authTab === 'signup') {
      const cleanEmail = emailInput.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        setAuthError(t.invalidEmailError);
        return;
      }
      if (passwordInput !== confirmPasswordInput) {
        setAuthError(t.passwordMismatchError);
        return;
      }
    }

    setIsAuthSubmitting(true);
    try {
      if (authTab === 'signup') {
        await registerStudioUser(
          emailInput.trim(),
          usernameInput.trim() || emailInput.trim().split('@')[0],
          passwordInput
        );
      } else {
        await loginStudioUser(emailInput.trim(), passwordInput);
      }
      setEmailInput('');
      setUsernameInput('');
      setPasswordInput('');
      setConfirmPasswordInput('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      onAuthChanged();
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication error');
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleOpenProfileSettings = () => {
    if (!user) return;
    setProfileNameInput(user.username || '');
    setProfileEmailInput(user.email || '');
    setProfileNewPassword('');
    setProfileConfirmPassword('');
    setShowProfilePassword(false);
    setShowProfileConfirmPassword(false);
    setProfileError(null);
    setProfileSuccess(null);
    setIsProfileSettingsOpen(true);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    const cleanEmail = profileEmailInput.trim();
    const cleanName = profileNameInput.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setProfileError(t.invalidEmailError);
      return;
    }
    if (profileNewPassword || profileConfirmPassword) {
      if (profileNewPassword.length < 4 || profileNewPassword !== profileConfirmPassword) {
        setProfileError(t.passwordMismatchError);
        return;
      }
    }

    setIsProfileSubmitting(true);
    try {
      await updateUserProfile(
        cleanEmail,
        cleanName,
        profileNewPassword ? profileNewPassword : undefined
      );
      setProfileNewPassword('');
      setProfileConfirmPassword('');
      setShowProfilePassword(false);
      setShowProfileConfirmPassword(false);
      setProfileSuccess(t.profileUpdatedMsg);
      onAuthChanged();
    } catch (err: any) {
      setProfileError(err?.message || 'Profile update failed.');
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  const hasOpenHeaderCard = isOmniboxOpen || isAccountCardOpen;

  return (
    <header className={`m3-top-app-bar ${hasOpenHeaderCard ? 'has-open-card' : ''}`}>
      {hasOpenHeaderCard && (
        <div
          className="m3-card-scrim"
          onClick={() => {
            if (!isLoadingSong) {
              setIsOmniboxOpen(false);
              onSetAccountCardOpen(false);
            }
          }}
        />
      )}
      <div className="m3-top-app-bar-inner">
        {/* SOL GRUP: Logo + Hemen Sağında Arama ve Yeni Proje */}
        <div className="m3-header-left">
          <div className="m3-brand-lockup">
            <div className="m3-brand-logo">
              <BrandLogoIcon size={20} />
            </div>
            <span className="m3-brand-title">
              Kythra <span className="m3-brand-subtitle">Studio</span>
            </span>
          </div>

          {/* Search Form (Desktop Pill + Mobile Icon Trigger Immediately Right of Logo) */}
          <div ref={omniboxRef} className="m3-omnibox-wrapper">
            {/* Desktop Search Pill */}
            <div className={`m3-omnibox-pill m3-desktop-omnibox-pill ${isOmniboxOpen ? 'is-open' : ''}`}>
              <md-icon style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                search
              </md-icon>

              <input
                type="text"
                value={query}
                onFocus={() => {
                  setIsOmniboxOpen(true);
                  onSetAccountCardOpen(false);
                }}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOmniboxOpen(true);
                }}
                placeholder={t.searchPlaceholder}
                className="m3-omnibox-input"
              />

              {query && (
                <md-icon-button
                  aria-label={t.clearSearch}
                  onClick={() => setQuery('')}
                >
                  <md-icon>close</md-icon>
                </md-icon-button>
              )}
            </div>

            {/* Mobile Search Icon Button (Placed right next to logo!) */}
            <div className="m3-mobile-search-trigger">
              <md-filled-tonal-icon-button
                data-role="mobile-search-btn"
                data-active={isOmniboxOpen ? 'true' : 'false'}
                aria-label={t.searchPlaceholder}
                title={t.searchPlaceholder}
                onClick={() => {
                  const nextOpen = !isOmniboxOpen;
                  setIsOmniboxOpen(nextOpen);
                  onSetAccountCardOpen(false);
                  if (nextOpen) {
                    window.setTimeout(() => mobileSearchInputRef.current?.focus(), 60);
                  }
                }}
              >
                <md-icon>search</md-icon>
              </md-filled-tonal-icon-button>
            </div>

            {/* Official Google Material 3 (<md-list> & <md-list-item>) Omnibox Dropdown Card */}
            {isOmniboxOpen && (
              <div className="m3-omnibox-dropdown">
                <md-elevation></md-elevation>

                {/* Mobile Search Input Row inside the Downward Card */}
                <div className="m3-mobile-card-search-bar">
                  <div className="m3-omnibox-pill is-open">
                    <md-icon style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                      search
                    </md-icon>
                    <input
                      ref={mobileSearchInputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="m3-omnibox-input"
                    />
                    {query ? (
                      <md-icon-button
                        aria-label={t.clearSearch}
                        onClick={() => setQuery('')}
                      >
                        <md-icon>close</md-icon>
                      </md-icon-button>
                    ) : (
                      <md-icon-button
                        aria-label={t.close}
                        onClick={() => setIsOmniboxOpen(false)}
                      >
                        <md-icon>close</md-icon>
                      </md-icon-button>
                    )}
                  </div>
                </div>

                {errorMessage && (
                  <div
                    className="md-typescale-label-medium"
                    style={{
                      backgroundColor: 'var(--md-sys-color-error-container)',
                      color: 'var(--md-sys-color-on-error-container)',
                      padding: '10px 16px'
                    }}
                  >
                    {errorMessage}
                  </div>
                )}

                {isLoadingSong ? (
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <md-circular-progress indeterminate={true}></md-circular-progress>
                      <div>
                        <div className="md-typescale-title-small">
                          {loadingMessage || t.loadingStudioTitle}
                        </div>
                        <div
                          className="md-typescale-body-small"
                          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                        >
                          {t.loadingStudioSub}
                        </div>
                      </div>
                    </div>
                    <md-linear-progress indeterminate={true}></md-linear-progress>
                  </div>
                ) : (
                  <div className="m3-omnibox-results-scroll">
                    {/* Kütüphane ve Özel Yüklemeler */}
                    {filteredLibrary.length > 0 ? (
                      <div>
                        <div
                          className="md-typescale-label-medium"
                          style={{
                            padding: '10px 16px 4px',
                            color: 'var(--md-sys-color-primary)'
                          }}
                        >
                          {query.trim() ? t.libraryFoundTitle : t.recentReadyTitle}
                        </div>
                        <md-list>
                          {filteredLibrary.slice(0, 8).map((item) => {
                            const { title: songTitle, artist } = parseSongTitleAndArtist(item.title);
                            return (
                              <md-list-item
                                key={item.track_key}
                                type="button"
                                onClick={() => handleSelectCachedTrackKey(item.track_key)}
                              >
                                <div slot="start" className="m3-source-logo-slot">
                                  <SourceOriginIcon
                                    source={detectSongSource(item.track_key)}
                                  />
                                </div>
                                <div slot="headline">{songTitle}</div>
                                <div slot="supporting-text">
                                  {artist ? `${artist} · ` : ''}
                                  {Math.round(item.tempo_bpm)} BPM · {formatDurationSec(item.duration_sec)}
                                </div>
                              </md-list-item>
                            );
                          })}
                        </md-list>
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: '18px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '10px'
                        }}
                      >
                        <span
                          className="md-typescale-body-small"
                          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                        >
                          {t.emptySearchHint}
                        </span>
                        <md-filled-tonal-button
                          onClick={() => {
                            setIsOmniboxOpen(false);
                            onOpenUploadDialog();
                          }}
                        >
                          <md-icon slot="icon">upload_file</md-icon>
                          <span>{t.uploadBtnFull}</span>
                        </md-filled-tonal-button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Arama Butonunun Hemen Yanında Yeni Proje / Dosya Yükle Butonu */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <md-filled-tonal-button
              data-role="upload-btn"
              data-active={isUploadDialogOpen ? 'true' : 'false'}
              title={t.uploadTitle}
              onClick={() => {
                setIsOmniboxOpen(false);
                onSetAccountCardOpen(false);
                onOpenUploadDialog();
              }}
            >
              <md-icon slot="icon">upload_file</md-icon>
              <span>{t.uploadBtnFull}</span>
            </md-filled-tonal-button>

            <div className="m3-mobile-upload-trigger">
              <md-filled-tonal-icon-button
                data-role="mobile-upload-btn"
                data-active={isUploadDialogOpen ? 'true' : 'false'}
                aria-label={t.uploadTitle}
                title={t.uploadTitle}
                onClick={() => {
                  setIsOmniboxOpen(false);
                  onSetAccountCardOpen(false);
                  onOpenUploadDialog();
                }}
              >
                <md-icon>upload_file</md-icon>
              </md-filled-tonal-icon-button>
            </div>
          </div>
        </div>

        {/* EN SAĞ GRUP: Tema Geçişi + Hesabım / Giriş Yap Butonu ve Aşağı Açılan Hesabım Kartı */}
        <div className="m3-header-right">
          <md-icon-button
            aria-label={isDarkMode ? t.switchToLight : t.switchToDark}
            title={isDarkMode ? t.switchToLight : t.switchToDark}
            onClick={onToggleDarkMode}
          >
            <md-icon>{isDarkMode ? 'light_mode' : 'dark_mode'}</md-icon>
          </md-icon-button>

          <div ref={accountWrapRef} style={{ position: 'relative', flexShrink: 0 }}>
            {/* Desktop Account / Sign In Button */}
            <md-filled-tonal-button
              data-role="desktop-account-btn"
              data-active={isAccountCardOpen ? 'true' : 'false'}
              title={user ? `${t.myAccountBtn} (${user.username})` : t.signInBtn}
              onClick={() => {
                onSetAccountCardOpen(!isAccountCardOpen);
                setIsProfileSettingsOpen(false);
                setIsOmniboxOpen(false);
                setAuthError(null);
              }}
            >
              <md-icon slot="icon">{user ? 'account_circle' : 'login'}</md-icon>
              <span>{user ? user.username : t.signInBtn}</span>
            </md-filled-tonal-button>

            {/* Mobile Account / Sign In Icon-Only Button (Always on the far right!) */}
            <div className="m3-mobile-account-trigger">
              <md-filled-tonal-icon-button
                data-role="mobile-account-btn"
                data-active={isAccountCardOpen ? 'true' : 'false'}
                aria-label={user ? t.myAccountBtn : t.signInBtn}
                title={user ? `${t.myAccountBtn} (${user.username})` : t.signInBtn}
                onClick={() => {
                  onSetAccountCardOpen(!isAccountCardOpen);
                  setIsProfileSettingsOpen(false);
                  setIsOmniboxOpen(false);
                  setAuthError(null);
                }}
              >
                <md-icon>{user ? 'account_circle' : 'person'}</md-icon>
              </md-filled-tonal-icon-button>
            </div>

            {/* Aşağı Açılan Hesabım / Giriş Yap & Kayıt Ol Kartı */}
            {isAccountCardOpen && (
              <div className="m3-account-dropdown-card">
                <md-elevation></md-elevation>

                {!user ? (
                  /* GİRİŞ YAPILMAMIŞSA: GİRİŞ YAP / KAYIT OL KARTI */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>account_circle</md-icon>
                        <span className="md-typescale-title-small">
                          {authTab === 'signin' ? t.signInTab : t.signUpTab}
                        </span>
                      </div>
                      <md-icon-button onClick={() => onSetAccountCardOpen(false)}>
                        <md-icon>close</md-icon>
                      </md-icon-button>
                    </div>

                    <div className="m3-account-tabs-row">
                      <button
                        type="button"
                        className={`m3-account-seg-btn ${authTab === 'signin' ? 'is-active' : ''}`}
                        onClick={() => {
                          setAuthTab('signin');
                          setAuthError(null);
                        }}
                      >
                        {t.signInTab}
                      </button>
                      <button
                        type="button"
                        className={`m3-account-seg-btn ${authTab === 'signup' ? 'is-active' : ''}`}
                        onClick={() => {
                          setAuthTab('signup');
                          setAuthError(null);
                        }}
                      >
                        {t.signUpTab}
                      </button>
                    </div>

                    {authError && (
                      <div
                        className="md-typescale-label-medium"
                        style={{
                          backgroundColor: 'var(--md-sys-color-error-container)',
                          color: 'var(--md-sys-color-on-error-container)',
                          padding: '8px 12px',
                          borderRadius: '12px'
                        }}
                      >
                        {authError}
                      </div>
                    )}

                    <form onSubmit={handleAuthSubmit} className="m3-auth-form-grid">
                      {authTab === 'signup' && (
                        <input
                          type="text"
                          required
                          autoComplete="name"
                          value={usernameInput}
                          onChange={(e) => setUsernameInput(e.target.value)}
                          placeholder={t.usernameLabel}
                          className="m3-clean-text-input"
                        />
                      )}
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder={t.emailLabel}
                        className="m3-clean-text-input"
                      />

                      {/* Parola + Göz Aç/Kapat İkonu */}
                      <div className="m3-password-field-wrap">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={4}
                          autoComplete={authTab === 'signup' ? 'new-password' : 'current-password'}
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder={t.passwordLabel}
                          className="m3-clean-text-input m3-password-input"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          aria-label={showPassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                          title={showPassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                          onClick={() => setShowPassword((v) => !v)}
                          className="m3-password-eye-btn"
                        >
                          <md-icon style={{ fontSize: '19px' }}>
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </md-icon>
                        </button>
                      </div>

                      {/* Kayıt Olurken Parolayı Doğrula + Göz Aç/Kapat İkonu */}
                      {authTab === 'signup' && (
                        <div className="m3-password-field-wrap">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            minLength={4}
                            autoComplete="new-password"
                            value={confirmPasswordInput}
                            onChange={(e) => setConfirmPasswordInput(e.target.value)}
                            placeholder={t.confirmPasswordLabel}
                            className="m3-clean-text-input m3-password-input"
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            aria-label={showConfirmPassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                            title={showConfirmPassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="m3-password-eye-btn"
                          >
                            <md-icon style={{ fontSize: '19px' }}>
                              {showConfirmPassword ? 'visibility_off' : 'visibility'}
                            </md-icon>
                          </button>
                        </div>
                      )}

                      <md-filled-button
                        type="submit"
                        className="m3-auth-submit-btn"
                        disabled={isAuthSubmitting || undefined}
                        style={{ marginTop: '4px', width: '100%' }}
                      >
                        {authTab === 'signin' ? t.signInTab : t.signUpTab}
                      </md-filled-button>
                    </form>
                  </div>
                ) : (
                  /* GİRİŞ YAPILMIŞSA: HESABIM KARTI (Favorilerim | Yüklediklerim) */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="m3-account-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div className="m3-avatar-badge">
                          {user.username.slice(0, 1).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div className="md-typescale-title-small" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.username}
                          </div>
                          <div className="md-typescale-body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.email}
                          </div>
                        </div>
                      </div>

                      <div className="m3-account-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <md-icon-button
                          aria-label={t.accountSettingsTitle}
                          title={t.accountSettingsTitle}
                          onClick={() => {
                            if (isProfileSettingsOpen) {
                              setIsProfileSettingsOpen(false);
                            } else {
                              handleOpenProfileSettings();
                            }
                          }}
                        >
                          <md-icon>{isProfileSettingsOpen ? 'arrow_back' : 'manage_accounts'}</md-icon>
                        </md-icon-button>
                        <md-text-button
                          onClick={() => {
                            setIsProfileSettingsOpen(false);
                            logoutStudioUser();
                            onAuthChanged();
                          }}
                        >
                          {t.signOutBtn}
                        </md-text-button>
                        <md-icon-button
                          aria-label={t.close}
                          onClick={() => {
                            setIsProfileSettingsOpen(false);
                            onSetAccountCardOpen(false);
                          }}
                        >
                          <md-icon>close</md-icon>
                        </md-icon-button>
                      </div>
                    </div>

                    {isProfileSettingsOpen ? (
                      /* HESAP AYARLARI BÖLÜMÜ (Görünen Ad, E-posta, Doğrulamalı Parola) */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <md-icon style={{ fontSize: '18px', color: 'var(--md-sys-color-primary)' }}>
                            manage_accounts
                          </md-icon>
                          <span className="md-typescale-title-small">{t.accountSettingsTitle}</span>
                        </div>

                        {profileError && (
                          <div
                            className="md-typescale-label-medium"
                            style={{
                              backgroundColor: 'var(--md-sys-color-error-container)',
                              color: 'var(--md-sys-color-on-error-container)',
                              padding: '8px 12px',
                              borderRadius: '12px'
                            }}
                          >
                            {profileError}
                          </div>
                        )}

                        {profileSuccess && (
                          <div
                            className="md-typescale-label-medium"
                            style={{
                              backgroundColor: 'var(--md-sys-color-primary-container)',
                              color: 'var(--md-sys-color-on-primary-container)',
                              padding: '8px 12px',
                              borderRadius: '12px'
                            }}
                          >
                            {profileSuccess}
                          </div>
                        )}

                        <form onSubmit={handleProfileSubmit} className="m3-auth-form-grid">
                          <input
                            type="text"
                            required
                            autoComplete="name"
                            value={profileNameInput}
                            onChange={(e) => setProfileNameInput(e.target.value)}
                            placeholder={t.usernameLabel}
                            className="m3-clean-text-input"
                          />
                          <input
                            type="email"
                            required
                            autoComplete="email"
                            value={profileEmailInput}
                            onChange={(e) => setProfileEmailInput(e.target.value)}
                            placeholder={t.emailLabel}
                            className="m3-clean-text-input"
                          />

                          <div className="m3-password-field-wrap">
                            <input
                              type={showProfilePassword ? 'text' : 'password'}
                              minLength={4}
                              autoComplete="new-password"
                              value={profileNewPassword}
                              onChange={(e) => setProfileNewPassword(e.target.value)}
                              placeholder={t.newPasswordOptionalLabel}
                              className="m3-clean-text-input m3-password-input"
                            />
                            <button
                              type="button"
                              tabIndex={-1}
                              aria-label={showProfilePassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                              title={showProfilePassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                              onClick={() => setShowProfilePassword((v) => !v)}
                              className="m3-password-eye-btn"
                            >
                              <md-icon style={{ fontSize: '19px' }}>
                                {showProfilePassword ? 'visibility_off' : 'visibility'}
                              </md-icon>
                            </button>
                          </div>

                          <div className="m3-password-field-wrap">
                            <input
                              type={showProfileConfirmPassword ? 'text' : 'password'}
                              minLength={4}
                              autoComplete="new-password"
                              value={profileConfirmPassword}
                              onChange={(e) => setProfileConfirmPassword(e.target.value)}
                              placeholder={t.confirmNewPasswordLabel}
                              className="m3-clean-text-input m3-password-input"
                            />
                            <button
                              type="button"
                              tabIndex={-1}
                              aria-label={showProfileConfirmPassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                              title={showProfileConfirmPassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                              onClick={() => setShowProfileConfirmPassword((v) => !v)}
                              className="m3-password-eye-btn"
                            >
                              <md-icon style={{ fontSize: '19px' }}>
                                {showProfileConfirmPassword ? 'visibility_off' : 'visibility'}
                              </md-icon>
                            </button>
                          </div>

                          <md-filled-button
                            type="submit"
                            className="m3-auth-submit-btn"
                            disabled={isProfileSubmitting || undefined}
                            style={{ marginTop: '4px', width: '100%' }}
                          >
                            {t.saveProfileBtn}
                          </md-filled-button>
                        </form>
                      </div>
                    ) : (
                      <>
                    {/* Hesabım Alt Sekmeleri: Favorilerim | Yüklediklerim */}
                    <div className="m3-account-tabs-row">
                      <button
                        type="button"
                        className={`m3-account-seg-btn ${accountSectionTab === 'favorites' ? 'is-active' : ''}`}
                        onClick={() => setAccountSectionTab('favorites')}
                      >
                        ★ {t.favoritesTab} ({favorites.length})
                      </button>
                      <button
                        type="button"
                        className={`m3-account-seg-btn ${accountSectionTab === 'uploads' ? 'is-active' : ''}`}
                        onClick={() => setAccountSectionTab('uploads')}
                      >
                        📁 {t.myUploadsTab} ({privateUploads.length})
                      </button>
                    </div>

                    {/* 1. FAVORİLERİM LİSTESİ */}
                    {accountSectionTab === 'favorites' && (
                      <div className="m3-account-list-scroll">
                        {favorites.length === 0 ? (
                          <div className="m3-account-empty-box">{t.emptyFavorites}</div>
                        ) : (
                          <md-list>
                            {favorites.map((fav) => (
                              <md-list-item
                                key={fav.track_key}
                                type="button"
                                onClick={() => handleSelectCachedTrackKey(fav.track_key)}
                              >
                                <md-icon slot="start" style={{ color: 'var(--md-sys-color-tertiary)' }}>
                                  star
                                </md-icon>
                                <div slot="headline">{fav.title}</div>
                                <div slot="supporting-text">
                                  {Math.round(fav.tempo_bpm)} BPM · {transposeKeySignature(fav.key_signature, 0, language)} · {fav.time_signature}
                                </div>
                              </md-list-item>
                            ))}
                          </md-list>
                        )}
                      </div>
                    )}

                    {/* 2. YÜKLEDİKLERİM (SADECE BU KULLANICIYA ÖZEL DOSYALAR) */}
                    {accountSectionTab === 'uploads' && (
                      <div className="m3-account-list-scroll">
                        <div
                          className="md-typescale-body-small"
                          style={{
                            backgroundColor: 'var(--md-sys-color-surface-container-low)',
                            color: 'var(--md-sys-color-on-surface-variant)',
                            padding: '8px 10px',
                            borderRadius: '10px',
                            marginBottom: '8px',
                            fontSize: '11.5px'
                          }}
                        >
                          {t.localDeviceNotice}
                        </div>
                        {privateUploads.length === 0 ? (
                          <div className="m3-account-empty-box">{t.emptyUploads}</div>
                        ) : (
                          <div className="m3-upload-manage-list">
                            {privateUploads.map((up) => {
                              const isEditing = editingTrackKey === up.track_key;
                              const isConfirming = confirmDeleteKey === up.track_key;
                              const isBusy = mutatingTrackKey === up.track_key;

                              return (
                                <div key={up.track_key} className="m3-upload-manage-row">
                                  {isEditing ? (
                                    <div className="m3-inline-rename-row" style={{ flex: 1 }}>
                                      <input
                                        type="text"
                                        value={editingTrackTitle}
                                        autoFocus
                                        disabled={isBusy}
                                        onChange={(e) => setEditingTrackTitle(e.target.value)}
                                        onKeyDown={async (e) => {
                                          if (e.key === 'Enter' && onRenameTrack) {
                                            const clean = editingTrackTitle.trim();
                                            if (clean) {
                                              setMutatingTrackKey(up.track_key);
                                              try {
                                                await onRenameTrack(up.track_key, clean);
                                                setEditingTrackKey(null);
                                              } finally {
                                                setMutatingTrackKey(null);
                                              }
                                            }
                                          }
                                          if (e.key === 'Escape') {
                                            setEditingTrackKey(null);
                                          }
                                        }}
                                        placeholder={t.trackTitlePlaceholder}
                                        className="m3-inline-rename-input"
                                      />
                                      <md-icon-button
                                        aria-label={t.saveTitleBtn}
                                        disabled={isBusy || undefined}
                                        onClick={async () => {
                                          const clean = editingTrackTitle.trim();
                                          if (!clean || !onRenameTrack) {
                                            setEditingTrackKey(null);
                                            return;
                                          }
                                          setMutatingTrackKey(up.track_key);
                                          try {
                                            await onRenameTrack(up.track_key, clean);
                                            setEditingTrackKey(null);
                                          } finally {
                                            setMutatingTrackKey(null);
                                          }
                                        }}
                                      >
                                        <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>check</md-icon>
                                      </md-icon-button>
                                      <md-icon-button
                                        aria-label={t.cancelActionBtn}
                                        disabled={isBusy || undefined}
                                        onClick={() => setEditingTrackKey(null)}
                                      >
                                        <md-icon>close</md-icon>
                                      </md-icon-button>
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        disabled={isBusy}
                                        onClick={() => handleSelectCachedTrackKey(up.track_key)}
                                        className="m3-upload-manage-main"
                                      >
                                        <md-icon style={{ color: 'var(--md-sys-color-primary)', fontSize: '20px', flexShrink: 0 }}>
                                          lock
                                        </md-icon>
                                        <div className="m3-upload-manage-text">
                                          <span className="m3-upload-manage-title" title={up.title}>
                                            {up.title}
                                          </span>
                                          <span className="m3-upload-manage-sub">
                                            {Math.round(up.tempo_bpm)} BPM · {transposeKeySignature(up.key_signature, 0, language)} · {up.time_signature}
                                          </span>
                                        </div>
                                      </button>

                                      <div className="m3-track-row-actions">
                                        {onRenameTrack && (
                                          <md-icon-button
                                            aria-label={t.renameTrackTooltip}
                                            title={t.renameTrackTooltip}
                                            disabled={isBusy || undefined}
                                            onClick={(e: React.MouseEvent) => {
                                              e.stopPropagation();
                                              setConfirmDeleteKey(null);
                                              setEditingTrackKey(up.track_key);
                                              setEditingTrackTitle(up.title);
                                            }}
                                          >
                                            <md-icon style={{ fontSize: '18px' }}>edit</md-icon>
                                          </md-icon-button>
                                        )}
                                        {onDeleteTrack && (
                                          isConfirming ? (
                                            <div className="m3-inline-delete-confirm">
                                              <button
                                                type="button"
                                                disabled={isBusy}
                                                className="m3-inline-delete-btn"
                                                onClick={async (e) => {
                                                  e.stopPropagation();
                                                  setMutatingTrackKey(up.track_key);
                                                  try {
                                                    await onDeleteTrack(up.track_key);
                                                  } finally {
                                                    setMutatingTrackKey(null);
                                                    setConfirmDeleteKey(null);
                                                  }
                                                }}
                                              >
                                                {t.confirmDeleteBtn}
                                              </button>
                                              <button
                                                type="button"
                                                disabled={isBusy}
                                                className="m3-inline-cancel-btn"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setConfirmDeleteKey(null);
                                                }}
                                              >
                                                {t.cancelActionBtn}
                                              </button>
                                            </div>
                                          ) : (
                                            <md-icon-button
                                              aria-label={t.deleteTrackTooltip}
                                              title={t.deleteTrackTooltip}
                                              disabled={isBusy || undefined}
                                              onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation();
                                                setConfirmDeleteKey(up.track_key);
                                              }}
                                            >
                                              <md-icon style={{ fontSize: '18px' }}>delete_outline</md-icon>
                                            </md-icon-button>
                                          )
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
