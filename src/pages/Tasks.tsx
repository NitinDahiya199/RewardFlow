// src/pages/Tasks.tsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Input, TextArea, Card, CardHeader, CardTitle, CardBody, FormGroup, Label, PageContainer } from '../components/common';
import { DatePicker } from '../components/common/DatePicker';
import { TimePicker } from '../components/common/TimePicker';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTasks, createTask, updateTask, deleteTask, toggleTaskComplete, Task } from '../store/slices/taskSlice';

const TasksContainer = styled(PageContainer)`
  max-width: 900px;
`;

const TasksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const TaskFormCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const TasksList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TaskCard = styled(Card)`
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TaskTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const TaskActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TaskDescription = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.6;
`;

const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const TaskDate = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.span<{ completed: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme, completed }) => (completed ? theme.colors.textSecondary : theme.colors.text)};
  text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textLight};
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.danger}20;
  border: 1px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textLight};
`;

const DateTimeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CountdownTimer = styled.div<{ $isOverdue: boolean; $isUrgent: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  margin-top: ${({ theme }) => theme.spacing.sm};
  background: ${({ $isOverdue, $isUrgent, theme }) => {
    if ($isOverdue) return `${theme.colors.danger}20`;
    if ($isUrgent) return `${theme.colors.warning}20`;
    return `${theme.colors.secondary}20`;
  }};
  color: ${({ $isOverdue, $isUrgent, theme }) => {
    if ($isOverdue) return theme.colors.danger;
    if ($isUrgent) return theme.colors.warning;
    return theme.colors.secondary;
  }};
  border: 1px solid ${({ $isOverdue, $isUrgent, theme }) => {
    if ($isOverdue) return theme.colors.danger;
    if ($isUrgent) return theme.colors.warning;
    return theme.colors.secondary;
  }};
`;

const DueDateLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled(Card)`
  max-width: 400px;
  width: 90%;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const ModalMessage = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.6;
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

// Date/Time Input Container with Icons
const DateTimeInputWrapper = styled.div`
  position: relative;
  cursor: pointer;
  
  input {
    padding-right: 40px;
    cursor: pointer;
    
    /* Hide default browser calendar/time icons */
    &[type="date"]::-webkit-calendar-picker-indicator,
    &[type="time"]::-webkit-calendar-picker-indicator {
      display: none;
      -webkit-appearance: none;
    }
    
    &[type="date"]::-webkit-inner-spin-button,
    &[type="time"]::-webkit-inner-spin-button {
      display: none;
      -webkit-appearance: none;
    }
    
    /* Firefox */
    &[type="date"]::-moz-calendar-picker-indicator,
    &[type="time"]::-moz-calendar-picker-indicator {
      display: none;
    }
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const SvgIcon = styled.svg`
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

export const Tasks = () => {
  const dispatch = useAppDispatch();
  const { tasks, isLoading, error } = useAppSelector((state) => state.tasks);
  const { user } = useAppSelector((state) => state.auth);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
  });
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; taskId: string | null }>({
    show: false,
    taskId: null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Fetch tasks when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTasks(user.id));
    }
  }, [dispatch, user?.id]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!deleteConfirm.show) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDeleteConfirm({ show: false, taskId: null });
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [deleteConfirm.show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement | HTMLInputElement | HTMLTextAreaElement>) => {
    // Handle Ctrl+Enter (Windows/Linux) or Cmd+Enter (Mac)
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      
      // Find the form
      const form = e.currentTarget.closest('form') as HTMLFormElement;
      if (form) {
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitButton && !submitButton.disabled) {
          // Close any open pickers first
          setShowDatePicker(false);
          setShowTimePicker(false);
          
          // Submit the form
          form.requestSubmit();
        }
      }
    }
  };

  // Global keyboard listener for form submission
  useEffect(() => {
    if (!showForm) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Handle Ctrl+Enter (Windows/Linux) or Cmd+Enter (Mac)
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        // Check if we're not in a picker or modal
        const target = e.target as HTMLElement;
        if (target.closest('[role="dialog"]') || target.closest('.date-picker-dropdown') || target.closest('.time-picker-dropdown')) {
          return; // Don't submit if inside a picker
        }

        e.preventDefault();
        e.stopPropagation();
        
        const form = document.querySelector('form') as HTMLFormElement;
        if (form) {
          const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
          if (submitButton && !submitButton.disabled) {
            // Close any open pickers first
            setShowDatePicker(false);
            setShowTimePicker(false);
            
            // Submit the form
            form.requestSubmit();
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      return;
    }

    // Combine date and time into ISO string
    let dueDateISO: string | null = null;
    if (formData.dueDate && formData.dueTime) {
      const dateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
      dueDateISO = dateTime.toISOString();
    } else if (formData.dueDate) {
      // If only date is provided, set time to end of day
      const dateTime = new Date(`${formData.dueDate}T23:59:59`);
      dueDateISO = dateTime.toISOString();
    }

    if (editingTask) {
      // Update existing task
      await dispatch(
        updateTask({
          id: editingTask,
          title: formData.title,
          description: formData.description,
          dueDate: dueDateISO,
        })
      ).unwrap();
      setEditingTask(null);
    } else {
      // Create new task
      await dispatch(
        createTask({
          title: formData.title,
          description: formData.description,
          userId: user.id,
          dueDate: dueDateISO,
        })
      ).unwrap();
    }
    setFormData({ title: '', description: '', dueDate: '', dueTime: '' });
    setShowForm(false);
  };

  const handleEdit = (task: Task) => {
    let dueDate = '';
    let dueTime = '';
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      dueDate = date.toISOString().split('T')[0];
      dueTime = date.toTimeString().slice(0, 5); // HH:mm format
    }
    setFormData({ 
      title: task.title, 
      description: task.description,
      dueDate,
      dueTime,
    });
    setEditingTask(task.id);
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ show: true, taskId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.taskId) {
      try {
        await dispatch(deleteTask(deleteConfirm.taskId)).unwrap();
        setDeleteConfirm({ show: false, taskId: null });
      } catch (error) {
        // Error is handled by Redux state
        console.error('Failed to delete task:', error);
        setDeleteConfirm({ show: false, taskId: null });
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, taskId: null });
  };

  const handleToggleComplete = async (id: string) => {
    try {
      await dispatch(toggleTaskComplete(id)).unwrap();
    } catch (error) {
      // Error is handled by Redux state
      console.error('Failed to toggle task:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '', dueDate: '', dueTime: '' });
    setEditingTask(null);
    setShowForm(false);
  };

  // Countdown timer component
  const CountdownDisplay = ({ dueDate }: { dueDate: string }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
      const updateCountdown = () => {
        const now = new Date().getTime();
        const due = new Date(dueDate).getTime();
        const difference = due - now;

        if (difference < 0) {
          setTimeLeft('Overdue');
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${seconds}s`);
        }
      };

      // Update immediately
      updateCountdown();
      
      // Update every second to show live countdown
      const interval = setInterval(updateCountdown, 1000);

      return () => clearInterval(interval);
    }, [dueDate]);

    const now = new Date().getTime();
    const due = new Date(dueDate).getTime();
    const difference = due - now;
    const hoursLeft = difference / (1000 * 60 * 60);
    const isOverdue = difference < 0;
    const isUrgent = !isOverdue && hoursLeft <= 24;

    return (
      <CountdownTimer $isOverdue={isOverdue} $isUrgent={isUrgent}>
        <DueDateLabel>Due:</DueDateLabel>
        {new Date(dueDate).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
        })}
        {' - '}
        {timeLeft}
      </CountdownTimer>
    );
  };

  // SVG Icons
  const CalendarIcon = () => (
    <SvgIcon viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </SvgIcon>
  );

  const ClockIcon = () => (
    <SvgIcon viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </SvgIcon>
  );

  return (
    <TasksContainer>
      <TasksHeader>
        <PageTitle>My Tasks</PageTitle>
        <Button 
          onClick={showForm ? handleCancel : () => setShowForm(true)}
          disabled={isLoading || !user?.id}
        >
          {showForm ? 'Cancel' : 'Add Task'}
        </Button>
      </TasksHeader>

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}

      {isLoading && tasks.length === 0 && (
        <LoadingMessage>Loading tasks...</LoadingMessage>
      )}

      {showForm && (
        <TaskFormCard>
          <CardHeader>
            <CardTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</CardTitle>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <FormGroup>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter task title"
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter task description"
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="dueDate">Due Date & Time (Optional)</Label>
                <DateTimeContainer>
                  <DateTimeInputWrapper>
                    <Input
                      type="text"
                      id="dueDate"
                      name="dueDate"
                      value={formData.dueDate ? new Date(formData.dueDate + 'T00:00:00').toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }).replace(/\s/g, ' ') : ''}
                      onChange={() => {}}
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      onKeyDown={handleKeyDown}
                      placeholder="Select date"
                      readOnly
                    />
                    <IconWrapper>
                      <CalendarIcon />
                    </IconWrapper>
                    <DatePicker
                      value={formData.dueDate}
                      onChange={(date) => {
                        setFormData({ ...formData, dueDate: date });
                      }}
                      minDate={new Date().toISOString().split('T')[0]}
                      isOpen={showDatePicker}
                      onClose={() => setShowDatePicker(false)}
                    />
                  </DateTimeInputWrapper>
                  <DateTimeInputWrapper>
                    <Input
                      type="text"
                      id="dueTime"
                      name="dueTime"
                      value={formData.dueTime ? (() => {
                        const [hours, minutes] = formData.dueTime.split(':');
                        const hour = parseInt(hours || '0');
                        const minute = parseInt(minutes || '0');
                        const period = hour >= 12 ? 'PM' : 'AM';
                        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                        return `${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
                      })() : ''}
                      onChange={() => {}}
                      onClick={() => formData.dueDate && setShowTimePicker(!showTimePicker)}
                      onKeyDown={handleKeyDown}
                      placeholder="Select time"
                      readOnly
                      disabled={!formData.dueDate}
                    />
                    <IconWrapper>
                      <ClockIcon />
                    </IconWrapper>
                    {showTimePicker && formData.dueDate && (
                      <TimePicker
                        value={formData.dueTime || '12:00'}
                        onChange={(time) => {
                          setFormData({ ...formData, dueTime: time });
                        }}
                        isOpen={showTimePicker}
                        onClose={() => setShowTimePicker(false)}
                        disabled={!formData.dueDate}
                      />
                    )}
                  </DateTimeInputWrapper>
                </DateTimeContainer>
              </FormGroup>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : editingTask ? 'Update Task' : 'Create Task'}
              </Button>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginTop: '0.5rem', textAlign: 'center' }}>
                Press Ctrl+Enter (Cmd+Enter on Mac) to submit
              </p>
            </Form>
          </CardBody>
        </TaskFormCard>
      )}

      {!isLoading && (
        <TasksList>
          {tasks.length === 0 ? (
            <EmptyState>
              <EmptyStateTitle>No tasks yet</EmptyStateTitle>
              <p>Click "Add Task" to create your first task!</p>
            </EmptyState>
          ) : (
          tasks.map((task) => (
            <TaskCard key={task.id}>
              <TaskHeader>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskActions>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(task)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDeleteClick(task.id)}>
                    Delete
                  </Button>
                </TaskActions>
              </TaskHeader>
              <TaskDescription>{task.description}</TaskDescription>
              {task.dueDate && <CountdownDisplay dueDate={task.dueDate} />}
              <TaskMeta>
                <CheckboxWrapper>
                  <Checkbox
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id)}
                  />
                  <CheckboxLabel completed={task.completed}>
                    {task.completed ? 'Completed' : 'Mark as complete'}
                  </CheckboxLabel>
                </CheckboxWrapper>
                <TaskDate>Created: {task.createdAt}</TaskDate>
              </TaskMeta>
            </TaskCard>
          ))
          )}
        </TasksList>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <ModalOverlay onClick={handleDeleteCancel}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Delete Task</ModalTitle>
            <ModalMessage>
              Are you sure you want to delete this task? This action cannot be undone.
            </ModalMessage>
            <ModalActions>
              <Button variant="outline" onClick={handleDeleteCancel}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </TasksContainer>
  );
};



