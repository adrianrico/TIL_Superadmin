import React from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntApp, ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LoaderProvider } from './context/LoaderContext.jsx';
import { themeConfig } from './theme/themeConfig.js';
import './index.css';

dayjs.locale('es');

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={themeConfig} locale={esES}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {/* AntApp: message/modal heredan el tema (los métodos estáticos no) */}
          <AntApp>
            <AuthProvider>
              <LoaderProvider>
                <App />
              </LoaderProvider>
            </AuthProvider>
          </AntApp>
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigProvider>
  </React.StrictMode>,
);
