import type { PropsWithChildren } from 'react';

import Header from './components/Header/Header';

import style from './App.module.css';

type ContentProps = {
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  theme: string;
};

const Layout = ({ setTheme, theme, children }: PropsWithChildren & ContentProps) => {

  return (
    <div className={style.container}>
      <Header
        theme={theme}
        setTheme={setTheme}
      />
      {children}
    </div>
  );
};

export default Layout;
