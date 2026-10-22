// Tokens de Ant Design: tema oscuro azul con superficies translúcidas (glassmorphism).
import { theme } from 'antd';

export const themeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#0695E4', // azul cian brillante
    colorBgBase: '#010d1a', // fondo casi negro azulado
    colorBgContainer: 'rgba(0, 18, 48, 0.35)',
    colorBgElevated: 'rgba(0, 18, 48, 0.92)', // modales y popovers
    colorText: '#c9d8e8', // cuerpo
    colorTextHeading: '#e8f4ff', // títulos
    colorTextSecondary: '#7aafc8', // texto atenuado
    colorBorder: 'rgba(6, 149, 228, 0.25)',
    colorBorderSecondary: 'rgba(6, 149, 228, 0.14)',
    borderRadius: 8,
  },
};
