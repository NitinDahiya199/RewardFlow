// src/components/common/TimePicker.tsx
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const TimePickerContainer = styled.div`
  position: relative;
`;

const TimePickerDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  min-width: 280px;
  max-width: 100%;
  z-index: 1000;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.surface} 0%,
    ${({ theme }) => theme.colors.surfaceLight} 100%
  );
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  padding: ${({ theme }) => theme.spacing.md};
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  animation: ${({ $isOpen }) => ($isOpen ? 'slideDown 0.2s ease-out' : 'none')};
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: visible;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TimePickerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TimeDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const TimeValueBox = styled.div<{ $isActive: boolean }>`
  min-width: 50px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ $isActive, theme }) => 
    $isActive ? theme.gradients.primary : theme.colors.surfaceHover};
  border: 2px solid ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ $isActive, theme }) => 
    $isActive ? '#FFFFFF' : theme.colors.text};
  text-align: center;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  transition: all 0.2s ease;
`;

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const TimePickerBody = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  max-height: 200px;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
`;

const TimeColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  min-width: 0;
  max-width: 100%;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    
    &:hover {
      background: ${({ theme }) => theme.colors.primaryLight};
    }
  }
`;

const TimeOption = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  max-width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.xs} 0;
  background: ${({ $isSelected, theme }) => 
    $isSelected ? theme.gradients.primary : 'transparent'};
  border: 2px solid ${({ $isSelected, theme }) => 
    $isSelected ? theme.colors.primary : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ $isSelected, theme }) => 
    $isSelected ? '#FFFFFF' : theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ $isSelected, theme }) => 
    $isSelected ? theme.fontWeight.semibold : theme.fontWeight.normal};
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${({ $isSelected, theme }) => 
      $isSelected ? theme.gradients.primary : theme.colors.surfaceHover};
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const TimePickerActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  transition: all 0.2s ease;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  isOpen: boolean;
  onClose: () => void;
  disabled?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({ 
  value, 
  onChange, 
  isOpen, 
  onClose,
  disabled = false 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const ampmRef = useRef<HTMLDivElement>(null);

  // Parse time value (HH:mm format)
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: 12, minute: 0, period: 'AM' };
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    let hour = hours;
    let period = 'AM';
    
    if (hour === 0) {
      hour = 12;
      period = 'AM';
    } else if (hour < 12) {
      period = 'AM';
    } else if (hour === 12) {
      period = 'PM';
    } else {
      hour = hour - 12;
      period = 'PM';
    }
    
    return { hour, minute: minutes || 0, period };
  };

  const { hour: currentHour, minute: currentMinute, period: currentPeriod } = parseTime(value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen && !disabled) {
      document.addEventListener('mousedown', handleClickOutside);
      
      // Scroll to selected values
      setTimeout(() => {
        if (hoursRef.current) {
          const selectedHour = hoursRef.current.querySelector(`[data-hour="${currentHour}"]`);
          selectedHour?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
        if (minutesRef.current) {
          const selectedMinute = minutesRef.current.querySelector(`[data-minute="${currentMinute}"]`);
          selectedMinute?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
        if (ampmRef.current) {
          const selectedPeriod = ampmRef.current.querySelector(`[data-period="${currentPeriod}"]`);
          selectedPeriod?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }, 100);
      
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, disabled, currentHour, currentMinute, currentPeriod, onClose]);

  const handleTimeChange = (hour: number, minute: number, period: string) => {
    let hour24 = hour;
    
    if (period === 'AM' && hour === 12) {
      hour24 = 0;
    } else if (period === 'PM' && hour !== 12) {
      hour24 = hour + 12;
    }
    
    const timeString = `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    onChange(timeString);
  };

  const handleHourChange = (hour: number) => {
    handleTimeChange(hour, currentMinute, currentPeriod);
  };

  const handleMinuteChange = (minute: number) => {
    handleTimeChange(currentHour, minute, currentPeriod);
  };

  const handlePeriodChange = (period: string) => {
    handleTimeChange(currentHour, currentMinute, period);
  };

  const handleClear = () => {
    onChange('');
    onClose();
  };

  const handleNow = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    onChange(timeString);
    onClose();
  };

  // Generate hour options (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Generate minute options (0-59, in 1-minute increments)
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  
  const periods = ['AM', 'PM'];

  return (
    <TimePickerContainer ref={containerRef}>
      <TimePickerDropdown $isOpen={isOpen && !disabled}>
        <TimePickerHeader>
          <TimeValueBox $isActive={false}>
            {String(currentHour).padStart(2, '0')}
          </TimeValueBox>
          <Separator>:</Separator>
          <TimeValueBox $isActive={false}>
            {String(currentMinute).padStart(2, '0')}
          </TimeValueBox>
          <TimeValueBox $isActive={false}>
            {currentPeriod}
          </TimeValueBox>
        </TimePickerHeader>

        <TimePickerBody>
          <TimeColumn ref={hoursRef}>
            {hours.map((hour) => (
              <TimeOption
                key={hour}
                $isSelected={currentHour === hour}
                onClick={() => handleHourChange(hour)}
                data-hour={hour}
                type="button"
              >
                {String(hour).padStart(2, '0')}
              </TimeOption>
            ))}
          </TimeColumn>

          <TimeColumn ref={minutesRef}>
            {minutes.map((minute) => (
              <TimeOption
                key={minute}
                $isSelected={currentMinute === minute}
                onClick={() => handleMinuteChange(minute)}
                data-minute={minute}
                type="button"
              >
                {String(minute).padStart(2, '0')}
              </TimeOption>
            ))}
          </TimeColumn>

          <TimeColumn ref={ampmRef}>
            {periods.map((period) => (
              <TimeOption
                key={period}
                $isSelected={currentPeriod === period}
                onClick={() => handlePeriodChange(period)}
                data-period={period}
                type="button"
              >
                {period}
              </TimeOption>
            ))}
          </TimeColumn>
        </TimePickerBody>

        <TimePickerActions>
          <ActionButton onClick={handleClear} type="button">
            Clear
          </ActionButton>
          <ActionButton onClick={handleNow} type="button">
            Now
          </ActionButton>
        </TimePickerActions>
      </TimePickerDropdown>
    </TimePickerContainer>
  );
};

