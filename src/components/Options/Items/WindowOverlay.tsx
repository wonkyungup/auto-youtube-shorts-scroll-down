import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import FontDownloadOffIcon from '@mui/icons-material/FontDownloadOff';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { store } from '../../../store';
import Defs from '../../../assets/constatns';

const OptionWindowOverlay = () => {
  const { clearWindowText } = store.getState().options;
  const { t } = useTranslation();
  const [state, setState] = useState(clearWindowText.state);
  const onClickHandler = () => {
    setState(!state);
    store.dispatch({
      type: Defs.REDUX_OPTION_WINDOW_OVERLAY,
      clearWindowText: !state,
    });
  };

  React.useEffect(() => {
    store.dispatch({
      type: Defs.REDUX_YTS_WINDOW_OVERLAY,
      clearWindowText: state,
    });
  }, [state]);

  return (
    <MenuItem onClick={onClickHandler}>
      <ListItemIcon>
        {state && <FontDownloadOffIcon fontSize="large" />}
        {!state && <FontDownloadIcon fontSize="large" />}
      </ListItemIcon>
      <ListItemText>{t('options:windowOverlay:title')}</ListItemText>
      <Typography variant="body2" color="text.secondary">
        {!state
          ? t('options:windowOverlay:show')
          : t('options:windowOverlay:hide')}
      </Typography>
    </MenuItem>
  );
};

export default OptionWindowOverlay;