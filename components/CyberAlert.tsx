import { Colors } from '@/constants/Colors';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react-native';
import React from 'react';
import { Modal, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button } from './Button';
import { CyberText } from './StyledText';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface CyberAlertProps {
    visible: boolean;
    title: string;
    message: string;
    type?: AlertType;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
}

export const CyberAlert = ({
    visible,
    title,
    message,
    type = 'warning',
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}: CyberAlertProps) => {

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={40} color={Colors.dark.success} />;
            case 'error': return <AlertTriangle size={40} color={Colors.dark.error} />;
            case 'warning': return <AlertTriangle size={40} color={Colors.dark.warning} />;
            default: return <Info size={40} color={Colors.dark.primary} />;
        }
    };

    const getGlowColor = () => {
        switch (type) {
            case 'success': return Colors.dark.success;
            case 'error': return Colors.dark.error;
            case 'warning': return Colors.dark.warning;
            default: return Colors.dark.primary;
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { borderColor: getGlowColor(), shadowColor: getGlowColor() }]}>
                    <View style={styles.iconContainer}>
                        {getIcon()}
                    </View>
                    
                    <CyberText variant="h2" style={styles.title}>{title}</CyberText>
                    <CyberText variant="body" style={styles.message}>{message}</CyberText>

                    <View style={styles.buttonContainer}>
                        {onCancel && (
                            <Button 
                                title={cancelText} 
                                variant="outline" 
                                onPress={onCancel} 
                                style={{ flex: 1, marginRight: 10 }}
                            />
                        )}
                        {onConfirm && (
                            <Button 
                                title={confirmText} 
                                variant="primary" 
                                onPress={onConfirm} 
                                style={{ flex: 1, marginLeft: 10, backgroundColor: getGlowColor() }}
                            />
                        )}
                        {!onConfirm && !onCancel && (
                             <Button 
                                title="Close" 
                                variant="outline" 
                                onPress={onCancel || (() => {})} 
                                style={{ flex: 1 }}
                            />
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderRadius: 20,
        borderWidth: 1,
        padding: 25,
        alignItems: 'center',
        ...Platform.select({
            web: {
                boxShadow: '0 0 30px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(20px)',
            },
            default: {
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
                elevation: 20,
            }
        })
    },
    iconContainer: {
        marginBottom: 20,
    },
    title: {
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        marginBottom: 30,
        opacity: 0.8,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
    }
});
