import * as React from 'react';
import { mergeStyleSets, Callout, Text } from '@fluentui/react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';

interface ActionCalloutProps {
  isOpen: boolean;
  message: string;
targetId: string;

  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

export const ActionCallout: React.FC<ActionCalloutProps> = ({
  isOpen,
  message,
  onConfirm,
  onClose,
  targetId,
  title = 'Confirmation',
  confirmText = 'OK',
  cancelText = 'Cancel',
}) => {
  return (
    <>
      {isOpen && (
        <Callout
          className={styles.callout}
          target={`#${targetId}`}
         
          role="alertdialog"
          isBeakVisible
        >
          <Text variant="mediumPlus" block style={{ marginBottom: 8 }}>
            {title}
          </Text>
          <Text variant="small" block style={{ marginBottom: 16 }}>
            {message}
          </Text>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            {confirmText==="Restore" && <PrimaryButton onClick={() => {
              onConfirm(); 
              onClose(); 
              }} text={confirmText} />}
            {confirmText==="Delete" && <PrimaryButton styles={{
    root: {
      backgroundColor: '#d32f2f',   // red background
      borderColor: '#d32f2f',
    },
    rootHovered: {
      backgroundColor: '#b71c1c',
      borderColor: '#b71c1c',
    },
  }} onClick={() => {
              onConfirm(); 
              onClose(); 
              }} text={confirmText} />}
            <DefaultButton onClick={onClose} text={cancelText} />
          </div>
        </Callout>
      )}
    </>
  );
};

const styles = mergeStyleSets({
  callout: {
    width: 320,
    padding: '20px 24px',
    zIndex: 1000,
  },
});
