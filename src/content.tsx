import './i18n';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SystemTheme from './components/SystemTheme';
import ToggleSwitch from './components/ToggleSwitch';
import OptionButton from './components/OptionButton';
import Browser from 'webextension-polyfill';
import Defs from './assets/constatns';
import YoutubeShorts from './assets/youtubeShorts';

let isAutoPlay: boolean = false;
const youtubeShorts = new YoutubeShorts(
  'shorts-container',
  'shorts-inner-container',
);
const App = () => {
  const [isSwitch, setIsSwitch] = React.useState(isAutoPlay);
  const handlerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    isAutoPlay = event.target.checked;
    setIsSwitch(isAutoPlay);
  };

  const openOptionModal = () => {
    console.log('openOptionModal');
  };

  React.useEffect(() => {
    if (isSwitch) {
      youtubeShorts.doesNextVideo();
    } else {
      youtubeShorts.doesLoopVideo();
    }
  }, [isSwitch]);

  return (
    <SystemTheme>
      <ToggleSwitch
        isSwitch={isSwitch}
        onChange={(event) => handlerChange(event)}
      />
      <OptionButton onClick={() => openOptionModal()} />
    </SystemTheme>
  );
};

window.onload = async () => {
  await Browser.runtime.sendMessage(Defs.EVENT_URL_DETECTION);
};

Browser.runtime.onMessage.addListener((request) => {
  if (request === Defs.EVENT_URL_DETECTION) {
    setTimeout(async () => {
      await youtubeShorts.setCurPlayVideo();

      const actions = youtubeShorts._innerContainer?.querySelectorAll(
        'ytd-shorts-player-controls',
      );
      if (actions) {
        const actionsList = actions[0].children;
        if (actionsList.length > 0) {
          const beforeDiv = actionsList[actionsList.length - 1];

          const autoYoutubeShortsScrollDown = document.getElementById(
            'auto-youtube-shorts-scroll-down',
          );
          if (autoYoutubeShortsScrollDown) {
            autoYoutubeShortsScrollDown.remove();
          }

          const div = document.createElement('div');
          div.id = 'auto-youtube-shorts-scroll-down';
          div.style.display = 'inline-block';
          div.style.position = 'relative';
          div.style.marginTop = '-7px';

          beforeDiv?.parentNode?.insertBefore(div, beforeDiv);
          ReactDOM.render(
            <App />,
            document.getElementById('auto-youtube-shorts-scroll-down'),
          );
        }
      }
    }, 500);
  }
});
