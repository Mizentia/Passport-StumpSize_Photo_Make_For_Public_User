export function getDefaultShortcuts() {
  return {
    tabUpload: 'Alt+1', tabEditor: 'Alt+2', tabSheet: 'Alt+3', tabHistory: 'Alt+4',
    openSettings: 'Alt+S', toggleTheme: 'Alt+T', toggleLang: 'Alt+L',
    openWebcam: 'Alt+W', chooseFile: 'Alt+O',
    autoFit: 'F', autoEnhance: 'E',
    removeBg: 'Alt+B', restoreBg: 'Alt+Shift+B',
    downloadSingle: 'Ctrl+S', downloadPng: 'Ctrl+Shift+S',
    downloadSheet: 'Ctrl+P', downloadPdf: 'Ctrl+Shift+P', printDirect: 'Ctrl+Shift+D',
    undo: 'Ctrl+Z', redo: 'Ctrl+Y', resetAll: 'Alt+R', resetFilters: 'Alt+F',
    zoomIn: '+', zoomOut: '-', zoomFit: '0',
    rotate: 'R', flipH: 'H', flipV: 'V', guides: 'G'
  };
}

export function createDefaultState() {
  return {
    originalImage: null, segmentedImage: null, isBackgroundRemoved: false,
    backgroundColor: '#ffffff', bgTolerance: 45, selectedPreset: 'bd_passport',
    customSize: { widthMm: 40, heightMm: 50, unit: 'mm' },
    activeTab: 'upload', lang: 'en', zoom: 1, rotation: 0,
    flipH: false, flipV: false, cropOffset: { x: 0, y: 0 }, showGuides: true,
    filters: {
      brightness: 100, contrast: 100, saturation: 100,
      sharpness: 25, smoothing: 0, warmth: 0, exposure: 0
    },
    selectedSuit: 'none', suitScale: 1.0, suitOffsetX: 0, suitOffsetY: 0,
    suitCollarWidth: 1.0, suitRotation: 0, suitBrightness: 100,
    paperPreset: 'photo_4r', sheetLayoutMode: 'combo_4r_4p_4s', sheetCopies: 6,
    sheetMarginMm: null, sheetGapMm: null,
    includeBorder: true, includeCutMarks: true, dpi: 300, customDpi: 300,
    exportFormat: 'image/jpeg', jpegQuality: 0.98, webpQuality: 0.95,
    borderColor: '#cbd5e1', borderWidth: 1, cutMarksStyle: 'inter_boundary',
    cutMarksWidth: 1, cutMarksColor: '#94a3b8',
    backdropShade: 50,
    namingTemplate: 'custom_builder',
    namingTokensOrder: ['agency', 'preset', 'dimensions', 'dpi', 'date'],
    namingSeparator: '_',
    autoSaveEnabled: true, studioName: 'Passport Photo Maker', studioPhone: '',
    enableStudioTag: false, enableWatermark: false, watermarkText: 'SAMPLE PROOF',
    defaultBackdropColor: '#ffffff', autoEnhanceOnUpload: false,
    bgEngineMode: 'auto', bgApiProvider: 'removebg', bgApiKey: '',
    bgCustomEndpoint: '', bgFeatherRadius: 2, targetKbLimit: null,
    bgEnginesConfig: {
      nl_studio_ai: { enabled: true },
      local_ai: { enabled: true },
      banana: { enabled: false, apiKey: '', modelKey: '' },
      gemini: { enabled: false, apiKey: '', model: 'gemini-2.0-flash' },
      huggingface: { enabled: false, apiKey: '', model: 'ZhengPeng7/BiRefNet' },
      photoroom: { enabled: false, apiKey: '' },
      cutoutpro: { enabled: false, apiKey: '' },
      removebg: { enabled: false, apiKey: '' },
      clipdrop: { enabled: false, apiKey: '' },
      custom_api: { enabled: false, endpoint: '', apiKey: '' },
      floodfill: { enabled: true, tolerance: 45 },
      chromakey: { enabled: false, keyColor: '#00ff00', tolerance: 40 }
    },
    selectedBgEngine: 'nl_studio_ai',
    headHeightRatio: 0.75, namingTemplate: 'preset_dpi_date',
    shortcuts: getDefaultShortcuts()
  };
}

export function extractStateSnapshot(s) {
  return {
    zoom: s.zoom, rotation: s.rotation, flipH: s.flipH, flipV: s.flipV,
    cropOffset: { ...s.cropOffset }, filters: { ...s.filters },
    selectedPreset: s.selectedPreset, customSize: { ...s.customSize },
    backgroundColor: s.backgroundColor, isBackgroundRemoved: s.isBackgroundRemoved,
    selectedSuit: s.selectedSuit, suitScale: s.suitScale,
    suitOffsetX: s.suitOffsetX, suitOffsetY: s.suitOffsetY,
    suitCollarWidth: s.suitCollarWidth, suitRotation: s.suitRotation,
    suitBrightness: s.suitBrightness
  };
}

export function getResetAdjustments() {
  return {
    zoom: 1, rotation: 0, flipH: false, flipV: false, cropOffset: { x: 0, y: 0 },
    backgroundColor: '#ffffff',
    filters: {
      brightness: 100, contrast: 100, saturation: 100,
      sharpness: 25, smoothing: 0, warmth: 0, exposure: 0
    },
    selectedSuit: 'none', suitScale: 1.0, suitOffsetX: 0, suitOffsetY: 0,
    suitCollarWidth: 1.0, suitRotation: 0, suitBrightness: 100
  };
}
