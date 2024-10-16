const config = {
  REACT_APP_PROJECT_STATE: 'production',
  REACT_APP_DEVELOPMENT_BACKEND_BASE_URL:
    window.location.hostname === '192.168.1.2'
      ? 'https://192.168.1.2:5000'
      : window.location.hostname === '192.168.220.1' ? 'https://192.168.220.1:5000' : 'https://localhost:5000',
  REACT_APP_PRODUCTION_BACKEND_BASE_URL: 'https://api.kalusugapp.com',
  REACT_APP_KEY:
    '446695e060e919602d5620e6312f315887004076d9f91e14958082263a7a3b56',
  REACT_APP_MAPBOX_KEY:
    'pk.eyJ1IjoiYW1wZWwtMjMiLCJhIjoiY2x2Z2NidzVjMHVjMDJpbnZtMThmNm51MCJ9.xce_TB3zt17jZYgYVG3new',
  REACT_APP_SECRET:
    '4ba06dc8a1b3bb89e184caf068a5dab8891cd990e18ce9be2f687fe704e0a40c'
};

export default config;