import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/Colors';
import { TransactionModal } from './TransactionModal';
import Svg, { Path, G, Defs, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend } from 'react-native-svg';

interface FinancialAnalysisContentProps {
  selectedAnalysis: string;
  formatCurrency: (amount: number) => string;
}

export function FinancialAnalysisContent({ selectedAnalysis, formatCurrency }: FinancialAnalysisContentProps) {
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedBudgetIndex, setSelectedBudgetIndex] = useState<number | null>(null);

  // Sample transaction data for the month
  const incomeTransactions = [
    { name: 'Salary Payment', amount: 3200, date: 'July 1, 2025', time: '09:00 AM' },
    { name: 'Freelance Project', amount: 750, date: 'July 15, 2025', time: '14:30 PM' },
    { name: 'Investment Dividend', amount: 150, date: 'July 20, 2025', time: '10:15 AM' },
    { name: 'Side Business', amount: 100, date: 'July 28, 2025', time: '16:45 PM' },
  ];

  const expenseTransactions = [
    { name: 'Rent Payment', amount: 1200, date: 'July 1, 2025', time: '08:00 AM' },
    { name: 'Groceries', amount: 450, date: 'July 5, 2025', time: '18:30 PM' },
    { name: 'Utilities', amount: 200, date: 'July 10, 2025', time: '14:00 PM' },
    { name: 'Gas & Transportation', amount: 180, date: 'July 12, 2025', time: '12:15 PM' },
    { name: 'Dining Out', amount: 320, date: 'July 18, 2025', time: '19:45 PM' },
    { name: 'Entertainment', amount: 150, date: 'July 22, 2025', time: '20:30 PM' },
    { name: 'Insurance', amount: 300, date: 'July 25, 2025', time: '10:00 AM' },
  ];

  const renderCashFlow = () => (
    <View>
      {/* Net Income */}
      <TouchableOpacity 
        style={{ marginBottom: 20 }}
        onPress={() => setShowIncomeModal(true)}
        activeOpacity={0.7}
      >
        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: AppColors.gray[500], marginBottom: 8 }}>
          Net Income
        </ThemedText>
        <ThemedText style={{ fontSize: 24, fontWeight: '700', color: AppColors.green[100] }}>
          {formatCurrency(4200)}
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: AppColors.gray[400] }}>
          +8.5% from last month 
        </ThemedText>
      </TouchableOpacity>

      {/* Total Expenses */}
      <TouchableOpacity 
        style={{ marginBottom: 20 }}
        onPress={() => setShowExpenseModal(true)}
        activeOpacity={0.7}
      >
        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: AppColors.gray[500], marginBottom: 8 }}>
          Total Expenses
        </ThemedText>
        <ThemedText style={{ fontSize: 24, fontWeight: '700', color: '#EF4444' }}>
          {formatCurrency(2800)}
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: AppColors.gray[400] }}>
          +3.2% from last month
        </ThemedText>
      </TouchableOpacity>

      {/* Net Cash Flow */}
      <View style={{ marginBottom: 20 }}>
        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: AppColors.gray[500], marginBottom: 8 }}>
          Net Cash Flow
        </ThemedText>
        <ThemedText style={{ fontSize: 24, fontWeight: '700', color: AppColors.green[100] }}>
          {formatCurrency(1400)}
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: AppColors.gray[400] }}>
          +15.3% from last month
        </ThemedText>
      </View>

      {/* Month-over-month change */}
      {/* <View style={{ backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12 }}>
        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: AppColors.gray[500], marginBottom: 8 }}>
          Month-over-Month Change
        </ThemedText>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <ThemedText style={{ fontSize: 14, color: AppColors.gray[400] }}>Cash Flow Improvement</ThemedText>
          <View style={{ backgroundColor: AppColors.green[100], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
            <ThemedText style={{ fontSize: 12, fontWeight: '600', color: AppColors.gray[0] }}>
              +{formatCurrency(185)}
            </ThemedText>
          </View>
        </View>
      </View> */}
    </View>
  );

  const renderBudgetAllocation = () => {
    const budgetData = [
      { name: 'Needs', amount: 1456, percentage: 52, color: '#EF4444', description: 'Rent, utilities, groceries' },
      { name: 'Wants', amount: 784, percentage: 28, color: '#F59E0B', description: 'Entertainment, dining out' },
      { name: 'Savings', amount: 560, percentage: 20, color: AppColors.green[100], description: 'Emergency fund, investments' }
    ];

    const totalAmount = budgetData.reduce((sum, item) => sum + item.amount, 0);

    // Generate donut chart paths
    const generateDonutPaths = () => {
      const centerX = 90;
      const centerY = 90;
      const outerRadius = 80;
      const innerRadius = 50;
      const gap = 0.08;
      
      let currentAngle = -Math.PI / 2;
      const paths: Array<{
        path: string;
        color: string;
        percentage: number;
      }> = [];
      
      budgetData.forEach((item) => {
        const segmentAngle = (item.percentage / 100) * (2 * Math.PI - gap * budgetData.length);
        const startAngle = currentAngle;
        const endAngle = currentAngle + segmentAngle;
        
        const path = createRoundedSegmentPath(centerX, centerY, outerRadius, innerRadius, startAngle, endAngle);
        
        paths.push({
          path,
          color: item.color,
          percentage: item.percentage,
        });
        
        currentAngle = endAngle + gap;
      });
      
      return paths;
    };

    const createRoundedSegmentPath = (
      centerX: number, centerY: number, outerRadius: number, innerRadius: number, startAngle: number, endAngle: number
    ) => {
      const outerStartX = centerX + outerRadius * Math.cos(startAngle);
      const outerStartY = centerY + outerRadius * Math.sin(startAngle);
      const outerEndX = centerX + outerRadius * Math.cos(endAngle);
      const outerEndY = centerY + outerRadius * Math.sin(endAngle);
      
      const innerStartX = centerX + innerRadius * Math.cos(startAngle);
      const innerStartY = centerY + innerRadius * Math.sin(startAngle);
      const innerEndX = centerX + innerRadius * Math.cos(endAngle);
      const innerEndY = centerY + innerRadius * Math.sin(endAngle);
      
      const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
      const outerArc = `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`;
      const innerArc = `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`;
      
      return `M ${outerStartX} ${outerStartY} ${outerArc} L ${innerEndX} ${innerEndY} ${innerArc} Z`;
    };

    const donutPaths = generateDonutPaths();

    return (
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        {/* Donut Chart */}
        <View style={{ position: 'relative', marginBottom: 24 }}>
          <Svg width={180} height={180} viewBox="0 0 180 180">
            <Defs>
              <Filter id="filter0_d_budget" x="0" y="0" width="180" height="180" filterUnits="userSpaceOnUse">
                <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
                <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <FeOffset dy="2"/>
                <FeGaussianBlur stdDeviation="6"/>
                <FeComposite in2="hardAlpha" operator="out"/>
                <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"/>
                <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_budget"/>
                <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_budget" result="shape"/>
              </Filter>
            </Defs>
            
            <G filter="url(#filter0_d_budget)">
              {donutPaths.map((segment, index) => {
                const opacity = selectedBudgetIndex === null ? 1 : (selectedBudgetIndex === index ? 1 : 0.35);
                return (
                  <Path
                    key={index}
                    d={segment.path}
                    fill={segment.color}
                    onPress={() => setSelectedBudgetIndex(prev => prev === index ? null : index)}
                    opacity={opacity}
                  />
                );
              })}
            </G>
          </Svg>
        </View>
        
        {/* Legend */}
        <View style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20
        }}>
          {budgetData.map((item, index) => {
            const isSelected = selectedBudgetIndex === index;
            return (
              <TouchableOpacity 
                key={index} 
                activeOpacity={0.8} 
                onPress={() => setSelectedBudgetIndex(prev => prev === index ? null : index)}
              >
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: 80,
                  ...(isSelected && {
                    backgroundColor: AppColors.gray[100],
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                  }),
                }}>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={{
                      fontSize: 11,
                      fontWeight: isSelected ? '600' : '500',
                      color: AppColors.gray[500],
                    }}>
                      {item.name}
                    </ThemedText>
                    <ThemedText style={{
                      fontSize: 10,
                      color: AppColors.gray[400],
                      fontWeight: isSelected ? '600' : '400',
                    }}>
                      {formatCurrency(item.amount)} {item.percentage}%
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderNetWorth = () => (
    <View>
      {/* Total Assets */}
      <View style={{ marginBottom: 20 }}>
        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: AppColors.gray[500], marginBottom: 8 }}>
          Total Assets
        </ThemedText>
        <ThemedText style={{ fontSize: 24, fontWeight: '700', color: AppColors.green[100] }}>
          {formatCurrency(125000)}
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: AppColors.gray[400] }}>
          Accounts, investments
        </ThemedText>
      </View>

      {/* Total Liabilities */}
      <View style={{ marginBottom: 20 }}>
        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: AppColors.gray[500], marginBottom: 8 }}>
          Total Liabilities
        </ThemedText>
        <ThemedText style={{ fontSize: 24, fontWeight: '700', color: '#EF4444' }}>
          {formatCurrency(45000)}
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: AppColors.gray[400] }}>
          Debts, loans
        </ThemedText>
      </View>

      {/* Net Worth */}
      <View style={{ marginBottom: 20 }}>
        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: AppColors.gray[500], marginBottom: 8 }}>
          Net Worth
        </ThemedText>
        <ThemedText style={{ fontSize: 12, fontWeight: '700', color: AppColors.primary[300] }}>
          {formatCurrency(80000)}
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: AppColors.gray[400] }}>
          +12.8% from last quarter
        </ThemedText>
      </View>
    </View>
  );

  const renderFinancialHealth = () => (
    <View>
      {/* Emergency Fund */}
      <View style={{ marginBottom: 20 }}>
        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: AppColors.gray[500], marginBottom: 8 }}>
          Emergency Fund
        </ThemedText>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <ThemedText style={{ fontSize: 24, fontWeight: '700', color: AppColors.green[100] }}>
            4.2 months
          </ThemedText>
          <View style={{ backgroundColor: AppColors.green[100], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 12 }}>
            <ThemedText style={{ fontSize: 12, fontWeight: '600', color: AppColors.gray[0] }}>
              Good
            </ThemedText>
          </View>
        </View>
        <ThemedText style={{ fontSize: 12, color: AppColors.gray[400] }}>
          Covers {formatCurrency(11760)} of monthly expenses
        </ThemedText>
      </View>

      {/* Debt-to-Income Ratio */}
      <View style={{ marginBottom: 20 }}>
        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: AppColors.gray[500], marginBottom: 8 }}>
          Debt-to-Income Ratio
        </ThemedText>
        <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between', marginBottom: 4 }}>
          <ThemedText style={{ fontSize: 24, fontWeight: '700', color: '#F59E0B' }}>
            28%
          </ThemedText>
          <View style={{ backgroundColor: '#F59E0B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 12 }}>
            <ThemedText style={{ fontSize: 12, fontWeight: '600', color: AppColors.gray[0] }}>
              Moderate
            </ThemedText>
          </View>
        </View>
        <ThemedText style={{ fontSize: 12, color: AppColors.gray[400] }}>
          Recommended: Below 36%
        </ThemedText>
      </View>

      {/* Savings Rate */}
      <View style={{ marginBottom: 20 }}>
        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: AppColors.gray[500], marginBottom: 8 }}>
          Savings Rate
        </ThemedText>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <ThemedText style={{ fontSize: 24, fontWeight: '700', color: AppColors.green[100] }}>
            20%
          </ThemedText>
          <View style={{ backgroundColor: AppColors.green[100], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 12 }}>
            <ThemedText style={{ fontSize: 12, fontWeight: '600', color: AppColors.gray[0] }}>
              Excellent
            </ThemedText>
          </View>
        </View>
        <ThemedText style={{ fontSize: 12, color: AppColors.gray[400] }}>
          {formatCurrency(840)} saved per month
        </ThemedText>
      </View>

      {/* Investment Allocation */}
      {/* <View style={{ backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12 }}>
        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: AppColors.gray[500], marginBottom: 12 }}>
          Investment Allocation
        </ThemedText>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <ThemedText style={{ fontSize: 14, color: AppColors.gray[400] }}>Stocks (70%)</ThemedText>
          <ThemedText style={{ fontSize: 14, fontWeight: '600', color: AppColors.gray[500] }}>
            {formatCurrency(56000)}
          </ThemedText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <ThemedText style={{ fontSize: 14, color: AppColors.gray[400] }}>Bonds (25%)</ThemedText>
          <ThemedText style={{ fontSize: 14, fontWeight: '600', color: AppColors.gray[500] }}>
            {formatCurrency(20000)}
          </ThemedText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <ThemedText style={{ fontSize: 14, color: AppColors.gray[400] }}>Cash (5%)</ThemedText>
          <ThemedText style={{ fontSize: 14, fontWeight: '600', color: AppColors.gray[500] }}>
            {formatCurrency(4000)}
          </ThemedText>
        </View>
      </View> */}
    </View>
  );

  const renderGoalsProgress = () => (
    <View>
      {/* Total Assets */}
      <View style={{ marginBottom: 20 }}>
        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: AppColors.gray[500], marginBottom: 8 }}>
          Total Assets
        </ThemedText>
        <ThemedText style={{ fontSize: 24, fontWeight: '700', color: AppColors.green[100] }}>
          {formatCurrency(125000)}
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: AppColors.gray[400] }}>
          Accounts, investments
        </ThemedText>
      </View>

      {/* Total Liabilities */}
      <View style={{ marginBottom: 20 }}>
        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: AppColors.gray[500], marginBottom: 8 }}>
          Total Liabilities
        </ThemedText>
        <ThemedText style={{ fontSize: 24, fontWeight: '700', color: '#EF4444' }}>
          {formatCurrency(45000)}
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: AppColors.gray[400] }}>
          Debts, loans
        </ThemedText>
      </View>

      {/* Net Worth */}
      <View style={{ marginBottom: 20 }}>
        <ThemedText style={{ fontSize: 16, fontWeight: '600', color: AppColors.gray[500], marginBottom: 8 }}>
          Net Worth
        </ThemedText>
        <ThemedText style={{ fontSize: 32, fontWeight: '700', color: AppColors.primary[300] }}>
          {formatCurrency(80000)}
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: AppColors.gray[400] }}>
          +12.8% from last quarter
        </ThemedText>
      </View>
    </View>
  );

  const getContent = () => {
    switch (selectedAnalysis) {
      case 'Cash flow':
        return renderCashFlow();
      case 'Budget Allocation':
        return renderBudgetAllocation();
      case 'Financial health':
        return renderFinancialHealth();
      case 'Net Worth':
        return renderGoalsProgress();
      default:
        return renderCashFlow();
    }
  };

  return (
    <View style={{ marginTop: 16, paddingBottom: selectedAnalysis === 'Net Worth' ? 40 : 0 }}>
      {getContent()}
      
      {/* Income Transactions Modal */}
      <TransactionModal
        visible={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        transactions={incomeTransactions}
        title="Income Transactions"
        date ="July 2025"
        type="income"
        formatCurrency={formatCurrency}
      />

      {/* Expense Transactions Modal */}
      <TransactionModal
        visible={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        transactions={expenseTransactions}
        title="Expense Transactions"
        date="July 2025"
        type="expense"
        formatCurrency={formatCurrency}
      />
    </View>
  );
} 