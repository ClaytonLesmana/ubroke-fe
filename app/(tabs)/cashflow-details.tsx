import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AppColors } from '@/constants/Colors';
import { Icon } from '@/components/Icon';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FilterDropdowns } from '@/components/cashflow/FilterDropdowns';
import { CashflowChart } from '@/components/cashflow/CashflowChart';
import { FlowCard } from '@/components/cashflow/FlowCard';

interface IncomeSource {
  name: string;
  amount: number;
  date: string;
  time: string;
}

export default function CashflowDetailsScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'In' | 'Out' | 'Net'>('In');
  const [selectedTransaction, setSelectedTransaction] = useState('Transactions');
  const [selectedMonth, setSelectedMonth] = useState('Calendar Month');
  const [currentMonth, setCurrentMonth] = useState('July 2025');
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(3); // Default to Sep 17 (index 3)
  const [scrollOffset, setScrollOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isTransactionDropdownVisible, setIsTransactionDropdownVisible] = useState(false);
  const [isMonthDropdownVisible, setIsMonthDropdownVisible] = useState(false);
  const [isAnalysisDropdownVisible, setIsAnalysisDropdownVisible] = useState(false);
  const [isAnalysisMonthDropdownVisible, setIsAnalysisMonthDropdownVisible] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;

  const transactionOptions = ['Transactions', 'Categories'];
  const analysisOptions = ['Cash flow', 'Budget Allocation', 'Financial health', ''];
  const [selectedAnalysis, setSelectedAnalysis] = useState('Cash flow');
  const [selectedAnalysisMonth, setSelectedAnalysisMonth] = useState('July 2025');
  
  // Month and year selection
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 5}, (_, i) => currentYear - i); // Current year and 4 years back
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMonthName, setSelectedMonthName] = useState('July');
  const [selectedYear, setSelectedYear] = useState(2025);
    // Dropdown animation
    useEffect(() => {
      Animated.timing(dropdownAnimation, {
        toValue: isDropdownOpen ? 1 : 0,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, [isDropdownOpen]);
    
  // Update selectedMonth when individual month/year changes
  React.useEffect(() => {
    setSelectedMonth(`${selectedMonthName} ${selectedYear}`);
  }, [selectedMonthName, selectedYear]);

  const incomeData = [
    { date: 'Sep 15', value: 250 },
    { date: 'Sep 15', value: 180 },
    { date: 'Sep 16', value: 320 },
    { date: 'Sep 17', value: 298 },
    { date: 'Sep 18', value: 150 },
    { date: 'Sep 19', value: 420 },
    { date: 'Sep 20', value: 380 },
    { date: 'Sep 21', value: 290 },
    { date: 'Sep 22', value: 450 },
    { date: 'Sep 23', value: 320 },
    { date: 'Sep 24', value: 280 },
    { date: 'Sep 25', value: 390 },
    { date: 'Sep 26', value: 350 },
    { date: 'Sep 27', value: 410 },
    { date: 'Sep 28', value: 330 },
  ];

  const netData = [
    { date: 'Jan', value: 1800 },
    { date: 'Feb', value: -800 },
    { date: 'Mar', value: 2200 },
    { date: 'Apr', value: 2500 },
    { date: 'May', value: -1200 },
    { date: 'Jun', value: 4800 },
    { date: 'Jul', value: 3200 },
    { date: 'Aug', value: -500 },
    { date: 'Sep', value: 2800 },
    { date: 'Oct', value: 1500 },
    { date: 'Nov', value: -300 },
    { date: 'Dec', value: 3500 },
  ];

  const incomeSources: IncomeSource[] = [
    {
      name: 'Salary Payment',
      amount: 250,
      date: 'Sep 15 2025',
      time: '09:00:00 AM'
    },
    {
      name: 'Freelance Project',
      amount: 180,
      date: 'Sep 15 2025',
      time: '14:30:00 PM'
    },
    {
      name: 'Investment Return',
      amount: 320,
      date: 'Sep 16 2025',
      time: '10:15:00 AM'
    },
    {
      name: 'Side Business',
      amount: 298,
      date: 'Sep 17 2025',
      time: '16:45:00 PM'
    },
    {
      name: 'Bonus Payment',
      amount: 150,
      date: 'Sep 18 2025',
      time: '11:30:00 AM'
    },
    {
      name: 'Consulting Fee',
      amount: 420,
      date: 'Sep 19 2025',
      time: '15:20:00 PM'
    }
  ];

  const expenseSources: IncomeSource[] = [
    {
      name: 'Rent Payment',
      amount: 180,
      date: 'Sep 15 2025',
      time: '08:00:00 AM'
    },
    {
      name: 'Groceries',
      amount: 120,
      date: 'Sep 16 2025',
      time: '18:30:00 PM'
    },
    {
      name: 'Gas Station',
      amount: 75,
      date: 'Sep 17 2025',
      time: '12:15:00 PM'
    },
    {
      name: 'Restaurant',
      amount: 45,
      date: 'Sep 18 2025',
      time: '19:45:00 PM'
    },
    {
      name: 'Utilities',
      amount: 200,
      date: 'Sep 19 2025',
      time: '14:00:00 PM'
    },
    {
      name: 'Coffee Shop',
      amount: 25,
      date: 'Sep 20 2025',
      time: '07:30:00 AM'
    }
  ];

  const networthSources: IncomeSource[] = [
    {
      name: 'Savings Account',
      amount: 15000,
      date: 'July 31 2025',
      time: '23:59:59 PM'
    },
    {
      name: 'Investment Portfolio',
      amount: 8500,
      date: 'July 31 2025',
      time: '23:59:59 PM'
    },
    {
      name: 'Emergency Fund',
      amount: 5000,
      date: 'July 31 2025',
      time: '23:59:59 PM'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Determine which data to use based on selected tab
  const currentData = selectedTab === 'Net' ? netData : incomeData;


  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollPercentage = contentOffset.x / (contentSize.width - layoutMeasurement.width);
    setScrollOffset(scrollPercentage);
  };

  const handleScrollbarPress = (event: any) => {
    const { locationX } = event.nativeEvent;
    const scrollbarWidth = 300; // Approximate scrollbar width
    const scrollPercentage = locationX / scrollbarWidth;
    const chartWidth = currentData.length * 60;
    const scrollViewWidth = 300; // Approximate visible width
    const maxScrollX = Math.max(0, chartWidth - scrollViewWidth);
    const targetX = scrollPercentage * maxScrollX;
    
    scrollViewRef.current?.scrollTo({ x: targetX, animated: true });
  };

  const handleBarPress = (index: number) => {
    const newSelectedIndex = selectedBarIndex === index ? null : index;
    setSelectedBarIndex(newSelectedIndex);
    
    // For In/Out tabs, set the selected date to highlight matching transactions
    if (selectedTab !== 'Net' && newSelectedIndex !== null) {
      setSelectedDate(currentData[newSelectedIndex].date);
    } else {
      setSelectedDate(null);
    }
  };

  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const bottomPadding = tabBarHeight + insets.bottom + 24; // extra breathing room

  return (
    <ThemedView style={{ flex: 1, backgroundColor: AppColors.primary[100] }}>
      <Image 
        source={require('@/assets/images/chatBackground.png')} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
        }}
        contentFit="cover"
      />
      {/* Status Bar Placeholder */}
      <View style={{ height: 0, backgroundColor: 'transparent' }} />
      
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        borderBottomRightRadius: 32,
        borderBottomLeftRadius: 32,
        paddingHorizontal: 20,
        paddingTop: 85,
        paddingBottom: 20,
        marginBottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
        backgroundColor: AppColors.gray[0],
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginLeft: 8,
          }}
        >
          <Icon name="backIcon" size={18} color={AppColors.gray[400]} />
        </TouchableOpacity>
        
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ThemedText style={{
            fontSize: 20,
            fontWeight: '500',
            justifyContent: 'center',
            color: AppColors.gray[500]
          }}>
            Cashflow Details
          </ThemedText>
        </View>
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        {/* Segmented Control */}
      <View style={{
        flexDirection: 'row',
        alignSelf: 'center',
        marginVertical: 20,
        backgroundColor: '#F8F9FA',
        borderRadius: 55,
        padding: 4,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}>
        {(['In', 'Out', 'Net'] as const).map((tab, index) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 55,
              marginRight: index === 0 ? 2 : 0,
              marginLeft: index === 2 ? 2 : 0,
              backgroundColor: selectedTab === tab ? AppColors.primary[300] : 'transparent',
              shadowColor: selectedTab === tab ? '#936DFF' : 'transparent',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: selectedTab === tab ? 0.3 : 0,
              shadowRadius: 4,
              elevation: selectedTab === tab ? 4 : 0,
            }}
            activeOpacity={0.8}
          >
            <ThemedText style={{
              fontSize: 16,
              fontWeight: '600',
              color: selectedTab === tab ? '#FFFFFF' : '#848484'
            }}>
              {tab}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
        {/* Your Income Card */}
        <View style={{
          backgroundColor: AppColors.gray[0],
          width: '90%',
          maxWidth: 400,
          marginHorizontal: 20,
          marginBottom: 20,
          borderRadius: 16,
          padding: 20,
          paddingTop: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4
        }}>
          {/* Filters - Hidden for Net view */}
          {selectedTab !== 'Net' && (
            <FilterDropdowns
              selectedTransaction={selectedTransaction}
              setSelectedTransaction={setSelectedTransaction}
              isTransactionDropdownVisible={isTransactionDropdownVisible}
              setIsTransactionDropdownVisible={setIsTransactionDropdownVisible}
              selectedMonth={selectedMonth}
              isMonthDropdownVisible={isMonthDropdownVisible}
              setIsMonthDropdownVisible={setIsMonthDropdownVisible}
              transactionOptions={transactionOptions}
              months={months}
              years={years}
              selectedMonthName={selectedMonthName}
              setSelectedMonthName={setSelectedMonthName}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          )}

          {/* Income Summary */}
          <View style={{ marginBottom: 24 }}>
            <ThemedText style={{
              fontSize: 14,
              color: AppColors.gray[400],
              marginBottom: 12
            }}>
              {selectedTab === 'Net' ? 'Your Outcome' : selectedTab === 'In' ? 'Your Income' : 'Your Expenses'}
            </ThemedText>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between'
            }}>
              <ThemedText style={{
                fontSize: 32,
                fontWeight: '700',
                color: AppColors.gray[500],
                lineHeight: 40
              }}>
                {selectedTab === 'Net' ? '$7,500' : selectedTab === 'In' ? '$12,540' : '$8,240'}
              </ThemedText>
              
              <View style={{ alignItems: 'flex-end' }}>
                <View style={{
                  backgroundColor: selectedTab === 'Net' ? '#EF4444' : '#EF4444',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12
                }}>
                  <ThemedText style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: AppColors.gray[0]
                  }}>
                    {selectedTab === 'Net' ? '↘ 5,25%' : '↘ 5,25%'}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Bar Chart */}
          <CashflowChart
            selectedTab={selectedTab}
            currentData={currentData}
            selectedBarIndex={selectedBarIndex}
            setSelectedBarIndex={handleBarPress}
            onScroll={handleScroll}
            onScrollbarPress={handleScrollbarPress}
            scrollOffset={scrollOffset}
            formatCurrency={formatCurrency}
          />
        </View>

        <FlowCard
          selectedTab={selectedTab}
          incomeSources={incomeSources}
          expenseSources={expenseSources}
          networthSources={networthSources}
          formatCurrency={formatCurrency}
          selectedDate={selectedDate}
          selectedAnalysis={selectedAnalysis}
          setSelectedAnalysis={setSelectedAnalysis}
          isAnalysisDropdownVisible={isAnalysisDropdownVisible}
          setIsAnalysisDropdownVisible={setIsAnalysisDropdownVisible}
          selectedAnalysisMonth={selectedAnalysisMonth}
          setSelectedAnalysisMonth={setSelectedAnalysisMonth}
          isAnalysisMonthDropdownVisible={isAnalysisMonthDropdownVisible}
          setIsAnalysisMonthDropdownVisible={setIsAnalysisMonthDropdownVisible}
          analysisOptions={analysisOptions}
          months={months}
          years={years}
          selectedYear={selectedYear}
        />


      </ScrollView>
    </ThemedView>
  );
} 