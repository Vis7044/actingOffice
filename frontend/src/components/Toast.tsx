import * as React from "react";
import {
  useId,
  Button,
  Field,
  RadioGroup,
  Radio,
  Toaster,
  useToastController,
  FluentProvider,
  webLightTheme,
  ToastTitle,
  Toast,
} from "@fluentui/react-components";

import type {ToastPosition} from '@fluentui/react-components'

export const ToastPositions = ({message="custom message"}: {message: unknown}) => {
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const [position, setPosition] = React.useState<ToastPosition>("bottom-end");
  const notify = () =>
    dispatchToast(
      <Toast>
        <ToastTitle>{message}</ToastTitle>
      </Toast>,
      { position, intent:  'error' }
    );

  return (
    <FluentProvider theme={webLightTheme}>
      
      <Toaster toasterId={toasterId} />
      
    </FluentProvider>
  );
};