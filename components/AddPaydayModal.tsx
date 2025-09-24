import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, ScrollView, TextInput, Alert, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import { Icon } from '@/components/Icon';

interface PaydayItem {
  incomeStream: string;
  amount: string;
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'yearly';
  nextPayment: string;
  type: string;
}

interface AddPaydayModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (items: PaydayItem[]) => void;
}

type Step = 'type' | 'amount' | 'schedule' | 'review';

const incomeTypes = [
  { id: 'salary', label: 'Salary/Job', icon: '💼' },
  { id: 'freelance', label: 'Freelance Work', icon: '💻' },
  { id: 'business', label: 'Side Business', icon: '🏪' },
  { id: 'investment', label: 'Investment Income', icon: '📈' },
  { id: 'rental', label: 'Rental Income', icon: '🏠' },
  { id: 'other', label: 'Other', icon: '💰' },
];

const frequencies = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'bi-weekly', label: 'Bi-weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
];

export function AddPaydayModal({ visible, onClose, onSave }: AddPaydayModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [paydayItem, setPaydayItem] = useState<PaydayItem>({
    incomeStream: '',
    amount: '',
    frequency: 'monthly',
    nextPayment: '',
    type: '',
  });

  const screenHeight = Dimensions.get('window').height;

  const resetModal = () => {
    setCurrentStep('type');
    setPaydayItem({
      incomeStream: '',
      amount: '',
      frequency: 'monthly',
      nextPayment: '',
      type: '',
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleNext = () => {
    const steps: Step[] = ['type', 'amount', 'schedule', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ['type', 'amount', 'schedule', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSave = () => {
    if (!paydayItem.incomeStream || !paydayItem.amount || !paydayItem.type) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    onSave([paydayItem]);
    handleClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'type':
        return paydayItem.type !== '';
      case 'amount':
        return paydayItem.amount !== '' && paydayItem.incomeStream !== '';
      case 'schedule':
        return paydayItem.nextPayment !== '';
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'type':
        return 'Income Source';
      case 'amount':
        return 'Income Details';
      case 'schedule':
        return 'Payment Schedule';
      case 'review':
        return 'Review & Save';
      default:
        return 'Add Income';
    }
  };

  const renderStepIndicator = () => (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    }}>
      {['type', 'amount', 'schedule', 'review'].map((step, index) => {
        const steps: Step[] = ['type', 'amount', 'schedule', 'review'];
        const currentIndex = steps.indexOf(currentStep);
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <View key={step} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: isActive ? AppColors.primary[300] : AppColors.gray[200],
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: isCurrent ? 2 : 0,
              borderColor: isCurrent ? AppColors.primary[300] : 'transparent',
            }}>
              <ThemedText style={{
                fontSize: 14,
                fontWeight: '600',
                color: isActive ? AppColors.gray[0] : AppColors.gray[400],
              }}>
                {index + 1}
              </ThemedText>
            </View>
            {index < 3 && (
              <View style={{
                width: 24,
                height: 2,
                backgroundColor: index < currentIndex ? AppColors.primary[300] : AppColors.gray[200],
                marginHorizontal: 8,
              }} />
            )}
          </View>
        );
      })}
    </View>
  );

  const renderTypeStep = () => (
    <View style={{ flex: 1 }}>
      <ThemedText style={{
        fontSize: 18,
        fontWeight: '600',
        color: AppColors.gray[500],
        textAlign: 'center',
        marginBottom: 8,
      }}>
        What type of income is this?
      </ThemedText>
      <ThemedText style={{
        fontSize: 14,
        color: AppColors.gray[400],
        textAlign: 'center',
        marginBottom: 32,
      }}>
        Select the category that best describes your income source
      </ThemedText>

      <ScrollView showsVerticalScrollIndicator={false}>
        {incomeTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            onPress={() => setPaydayItem({ ...paydayItem, type: type.id, incomeStream: type.label })}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              marginBottom: 12,
              borderRadius: 12,
              backgroundColor: paydayItem.type === type.id ? AppColors.primary[100] : AppColors.gray[100],
              borderWidth: paydayItem.type === type.id ? 2 : 1,
              borderColor: paydayItem.type === type.id ? AppColors.primary[300] : AppColors.gray[200],
            }}
          >
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: AppColors.gray[0],
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              <ThemedText style={{ fontSize: 24 }}>{type.icon}</ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={{
                fontSize: 16,
                fontWeight: '600',
                color: AppColors.gray[500],
              }}>
                {type.label}
              </ThemedText>
            </View>
            {paydayItem.type === type.id && (
              <Icon name="rightArrow" size={16} color={AppColors.primary[300]} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderAmountStep = () => (
    <View style={{ flex: 1 }}>
      <ThemedText style={{
        fontSize: 18,
        fontWeight: '600',
        color: AppColors.gray[500],
        textAlign: 'center',
        marginBottom: 8,
      }}>
        How much do you earn?
      </ThemedText>
      <ThemedText style={{
        fontSize: 14,
        color: AppColors.gray[400],
        textAlign: 'center',
        marginBottom: 32,
      }}>
        Enter your income amount and frequency
      </ThemedText>

      {/* Custom Income Stream Name */}
      <View style={{ marginBottom: 24 }}>
        <ThemedText style={{
          fontSize: 14,
          fontWeight: '600',
          color: AppColors.gray[500],
          marginBottom: 8,
        }}>
          Income Stream Name
        </ThemedText>
        <TextInput
          value={paydayItem.incomeStream}
          onChangeText={(text) => setPaydayItem({ ...paydayItem, incomeStream: text })}
          placeholder="e.g., Software Engineer at TechCorp"
          style={{
            backgroundColor: AppColors.gray[0],
            borderWidth: 1,
            borderColor: AppColors.gray[200],
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: AppColors.gray[500],
          }}
          placeholderTextColor={AppColors.gray[400]}
        />
      </View>

      {/* Amount Input */}
      <View style={{ marginBottom: 24 }}>
        <ThemedText style={{
          fontSize: 14,
          fontWeight: '600',
          color: AppColors.gray[500],
          marginBottom: 8,
        }}>
          Amount
        </ThemedText>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: AppColors.gray[0],
          borderWidth: 1,
          borderColor: AppColors.gray[200],
          borderRadius: 12,
          paddingHorizontal: 16,
        }}>
          <ThemedText style={{
            fontSize: 18,
            fontWeight: '600',
            color: AppColors.gray[400],
            marginRight: 8,
          }}>
            $
          </ThemedText>
          <TextInput
            value={paydayItem.amount}
            onChangeText={(text) => {
              // Only allow numbers and decimal point
              const numericText = text.replace(/[^0-9.]/g, '');
              setPaydayItem({ ...paydayItem, amount: numericText });
            }}
            placeholder="5,000"
            keyboardType="numeric"
            style={{
              flex: 1,
              fontSize: 24,
              fontWeight: '700',
              color: AppColors.gray[500],
              padding: 16,
            }}
            placeholderTextColor={AppColors.gray[400]}
          />
        </View>
      </View>

      {/* Frequency Selection */}
      <View>
        <ThemedText style={{
          fontSize: 14,
          fontWeight: '600',
          color: AppColors.gray[500],
          marginBottom: 12,
        }}>
          Payment Frequency
        </ThemedText>
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          {frequencies.map((freq) => (
            <TouchableOpacity
              key={freq.id}
              onPress={() => setPaydayItem({ ...paydayItem, frequency: freq.id as any })}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor: paydayItem.frequency === freq.id ? AppColors.primary[300] : AppColors.gray[100],
                borderWidth: 1,
                borderColor: paydayItem.frequency === freq.id ? AppColors.primary[300] : AppColors.gray[200],
              }}
            >
              <ThemedText style={{
                fontSize: 14,
                fontWeight: '600',
                color: paydayItem.frequency === freq.id ? AppColors.gray[0] : AppColors.gray[500],
              }}>
                {freq.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderScheduleStep = () => (
    <View style={{ flex: 1 }}>
      <ThemedText style={{
        fontSize: 18,
        fontWeight: '600',
        color: AppColors.gray[500],
        textAlign: 'center',
        marginBottom: 8,
      }}>
        When do you get paid?
      </ThemedText>
      <ThemedText style={{
        fontSize: 14,
        color: AppColors.gray[400],
        textAlign: 'center',
        marginBottom: 32,
      }}>
        Set your next payment date
      </ThemedText>

      <View style={{ marginBottom: 24 }}>
        <ThemedText style={{
          fontSize: 14,
          fontWeight: '600',
          color: AppColors.gray[500],
          marginBottom: 8,
        }}>
          Next Payment Date
        </ThemedText>
        <TextInput
          value={paydayItem.nextPayment}
          onChangeText={(text) => setPaydayItem({ ...paydayItem, nextPayment: text })}
          placeholder="MM/DD/YYYY"
          style={{
            backgroundColor: AppColors.gray[0],
            borderWidth: 1,
            borderColor: AppColors.gray[200],
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: AppColors.gray[500],
          }}
          placeholderTextColor={AppColors.gray[400]}
        />
      </View>

      {/* Payment Preview */}
      <View style={{
        backgroundColor: AppColors.primary[100],
        borderRadius: 12,
        padding: 16,
        marginTop: 24,
      }}>
        <ThemedText style={{
          fontSize: 14,
          fontWeight: '600',
          color: AppColors.gray[500],
          marginBottom: 8,
        }}>
          Payment Schedule Preview
        </ThemedText>
        <ThemedText style={{
          fontSize: 16,
          color: AppColors.gray[400],
        }}>
          You'll receive ${paydayItem.amount} {paydayItem.frequency} starting {paydayItem.nextPayment || 'on the date you specify'}
        </ThemedText>
      </View>
    </View>
  );

  const renderReviewStep = () => (
    <View style={{ flex: 1 }}>
      <ThemedText style={{
        fontSize: 18,
        fontWeight: '600',
        color: AppColors.gray[500],
        textAlign: 'center',
        marginBottom: 8,
      }}>
        Review Your Income
      </ThemedText>
      <ThemedText style={{
        fontSize: 14,
        color: AppColors.gray[400],
        textAlign: 'center',
        marginBottom: 32,
      }}>
        Make sure everything looks correct
      </ThemedText>

      <View style={{
        backgroundColor: AppColors.gray[0],
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: AppColors.gray[200],
      }}>
        <View style={{ marginBottom: 16 }}>
          <ThemedText style={{
            fontSize: 12,
            color: AppColors.gray[400],
            marginBottom: 4,
          }}>
            INCOME SOURCE
          </ThemedText>
          <ThemedText style={{
            fontSize: 16,
            fontWeight: '600',
            color: AppColors.gray[500],
          }}>
            {paydayItem.incomeStream}
          </ThemedText>
        </View>

        <View style={{ marginBottom: 16 }}>
          <ThemedText style={{
            fontSize: 12,
            color: AppColors.gray[400],
            marginBottom: 4,
          }}>
            AMOUNT & FREQUENCY
          </ThemedText>
          <ThemedText style={{
            fontSize: 24,
            fontWeight: '700',
            color: AppColors.primary[300],
          }}>
            ${paydayItem.amount}
          </ThemedText>
          <ThemedText style={{
            fontSize: 14,
            color: AppColors.gray[400],
            textTransform: 'capitalize',
          }}>
            {paydayItem.frequency}
          </ThemedText>
        </View>

        <View>
          <ThemedText style={{
            fontSize: 12,
            color: AppColors.gray[400],
            marginBottom: 4,
          }}>
            NEXT PAYMENT
          </ThemedText>
          <ThemedText style={{
            fontSize: 16,
            fontWeight: '600',
            color: AppColors.gray[500],
          }}>
            {paydayItem.nextPayment}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'type':
        return renderTypeStep();
      case 'amount':
        return renderAmountStep();
      case 'schedule':
        return renderScheduleStep();
      case 'review':
        return renderReviewStep();
      default:
        return renderTypeStep();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
      }}>
        <View style={{
          backgroundColor: AppColors.gray[0],
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: screenHeight * 0.9,
          paddingTop: 12,
          paddingHorizontal: 20,
          paddingBottom: 34,
        }}>
          {/* Drag Handle */}
          <View style={{
            width: 40,
            height: 4,
            backgroundColor: AppColors.gray[300],
            borderRadius: 2,
            alignSelf: 'center',
            marginBottom: 20,
          }} />

          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <TouchableOpacity onPress={handleClose}>
              <Icon name="crossIcon" size={20} color={AppColors.gray[400]} />
            </TouchableOpacity>
            <ThemedText style={{
              fontSize: 18,
              fontWeight: '600',
              color: AppColors.gray[500],
            }}>
              {getStepTitle()}
            </ThemedText>
            <View style={{ width: 20 }} />
          </View>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Step Content */}
          {renderCurrentStep()}

          {/* Navigation Buttons */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 24,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: AppColors.gray[200],
          }}>
            <TouchableOpacity
              onPress={currentStep === 'type' ? handleClose : handleBack}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: AppColors.gray[100],
              }}
            >
              <ThemedText style={{
                fontSize: 16,
                fontWeight: '600',
                color: AppColors.gray[500],
              }}>
                {currentStep === 'type' ? 'Cancel' : 'Back'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={currentStep === 'review' ? handleSave : handleNext}
              disabled={!canProceed()}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: canProceed() ? AppColors.primary[300] : AppColors.gray[200],
              }}
            >
              <ThemedText style={{
                fontSize: 16,
                fontWeight: '600',
                color: canProceed() ? AppColors.gray[0] : AppColors.gray[400],
              }}>
                {currentStep === 'review' ? 'Save Income' : 'Next'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
} 