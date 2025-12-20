// src/pages/UserDetails.tsx
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Card, CardHeader, CardTitle, CardBody, PageContainer, Button, Input, TextArea } from '../components/common';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchUserProfile, updateUserProfile } from '../store/slices/userSlice';
import { fetchTasks } from '../store/slices/taskSlice';
import { useToast } from '../components/common/Toast';

const UserDetailsContainer = styled(PageContainer)`
  max-width: 1000px;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const LargeAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const UserName = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSize.xxxl};
  color: ${({ theme }) => theme.colors.text};
`;

const UserEmail = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const UserBio = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSize.md};
  max-width: 600px;
  line-height: 1.6;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const InfoCard = styled(Card)`
  height: 100%;
`;

const InfoSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const StatItem = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surfaceLight || theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textLight};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const CardHeaderWithButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const SectionButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const UserDetails = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profile, isLoading: profileLoading, error: profileError } = useAppSelector((state) => state.user);
  const { tasks, isLoading: tasksLoading } = useAppSelector((state) => state.tasks);
  const { showToast } = useToast();
  
  const [editingSection, setEditingSection] = useState<'personal' | 'account' | 'about' | null>(null);
  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    website: '',
    role: '',
    company: '',
    bio: '',
  });

  // Fetch profile and tasks when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProfile(user.id));
      dispatch(fetchTasks(user.id));
    }
  }, [dispatch, user?.id]);

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
    };
  }, [tasks]);

  // Format date helper
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Format relative time helper
  const formatRelativeTime = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / 60000);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      return formatDate(dateString);
    } catch {
      return dateString;
    }
  };

  // Initialize form data when profile loads or editing starts
  useEffect(() => {
    if (profile) {
      setFormData({
        phone: profile.phone || '',
        location: profile.location || '',
        website: profile.website || '',
        role: profile.role || '',
        company: profile.company || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  // Get display data (use profile if available, fallback to auth user)
  const displayData = useMemo(() => {
    const name = profile?.name || user?.name || 'User';
    const email = profile?.email || user?.email || 'No email';
    const bio = editingSection === 'about' ? formData.bio : (profile?.bio || '');
    const phone = editingSection === 'personal' ? formData.phone : (profile?.phone || 'N/A');
    const location = editingSection === 'personal' ? formData.location : (profile?.location || 'N/A');
    const website = editingSection === 'personal' ? formData.website : (profile?.website || '');
    const role = editingSection === 'account' ? formData.role : (profile?.role || 'N/A');
    const company = editingSection === 'account' ? formData.company : (profile?.company || 'N/A');
    const joinDate = profile?.joinDate ? formatDate(profile.joinDate) : 'N/A';
    const lastActive = profile?.lastActive ? formatRelativeTime(profile.lastActive) : 'N/A';

    return {
      name,
      email,
      bio,
      phone,
      location,
      website,
      role,
      company,
      joinDate,
      lastActive,
      accountStatus: 'Active', // This could come from profile or auth state
      ...taskStats,
    };
  }, [profile, user, taskStats, editingSection, formData]);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (section: 'personal' | 'account' | 'about') => {
    if (!user?.id) return;

    try {
      const updateData: any = { userId: user.id };
      
      if (section === 'personal') {
        updateData.phone = formData.phone || undefined;
        updateData.location = formData.location || undefined;
        updateData.website = formData.website || undefined;
      } else if (section === 'account') {
        updateData.role = formData.role || undefined;
        updateData.company = formData.company || undefined;
      } else if (section === 'about') {
        updateData.bio = formData.bio || undefined;
      }

      await dispatch(updateUserProfile(updateData)).unwrap();
      
      setEditingSection(null);
      showToast('Profile updated successfully!', 'success');
    } catch (error: any) {
      showToast(error || 'Failed to update profile', 'error');
    }
  };

  const handleCancel = (section: 'personal' | 'account' | 'about') => {
    setEditingSection(null);
    // Reset form data from profile for the specific section
    if (profile) {
      if (section === 'personal') {
        setFormData({
          ...formData,
          phone: profile.phone || '',
          location: profile.location || '',
          website: profile.website || '',
        });
      } else if (section === 'account') {
        setFormData({
          ...formData,
          role: profile.role || '',
          company: profile.company || '',
        });
      } else if (section === 'about') {
        setFormData({
          ...formData,
          bio: profile.bio || '',
        });
      }
    }
  };

  const handleEditClick = (section: 'personal' | 'account' | 'about') => {
    setEditingSection(section);
    // Initialize form data for the section being edited
    if (profile) {
      if (section === 'personal') {
        setFormData({
          ...formData,
          phone: profile.phone || '',
          location: profile.location || '',
          website: profile.website || '',
        });
      } else if (section === 'account') {
        setFormData({
          ...formData,
          role: profile.role || '',
          company: profile.company || '',
        });
      } else if (section === 'about') {
        setFormData({
          ...formData,
          bio: profile.bio || '',
        });
      }
    }
  };

  // Loading state
  if (profileLoading && !profile) {
    return (
      <UserDetailsContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          Loading user details...
        </div>
      </UserDetailsContainer>
    );
  }

  // Error state
  if (profileError && !profile) {
    return (
      <UserDetailsContainer>
        <Card>
          <CardBody>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#fee', 
              border: '1px solid #fcc', 
              borderRadius: '4px',
              color: '#c33'
            }}>
              Error loading profile: {profileError}
            </div>
          </CardBody>
        </Card>
      </UserDetailsContainer>
    );
  }

  return (
    <UserDetailsContainer>
      <HeaderSection>
        <LargeAvatar>{getInitials(displayData.name)}</LargeAvatar>
        <UserName>{displayData.name}</UserName>
        <UserEmail>{displayData.email}</UserEmail>
        {displayData.bio && <UserBio>{displayData.bio}</UserBio>}
      </HeaderSection>

      <CardsGrid>
        <InfoCard>
          <CardHeader>
            <CardHeaderWithButton>
              <CardTitle>Personal Information</CardTitle>
              {editingSection === 'personal' ? (
                <SectionButtonGroup>
                  <Button 
                    size="sm" 
                    onClick={() => handleSave('personal')} 
                    disabled={profileLoading}
                  >
                    {profileLoading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleCancel('personal')} 
                    disabled={profileLoading}
                  >
                    Cancel
                  </Button>
                </SectionButtonGroup>
              ) : (
                <Button size="sm" onClick={() => handleEditClick('personal')}>
                  Edit
                </Button>
              )}
            </CardHeaderWithButton>
          </CardHeader>
          <CardBody>
            <InfoSection>
              <InfoLabel>Full Name</InfoLabel>
              <InfoValue>{displayData.name}</InfoValue>
            </InfoSection>
            <InfoSection>
              <InfoLabel>Email Address</InfoLabel>
              <InfoValue>{displayData.email}</InfoValue>
            </InfoSection>
            <InfoSection>
              <InfoLabel>Phone Number</InfoLabel>
              {editingSection === 'personal' ? (
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              ) : (
                <InfoValue>{displayData.phone}</InfoValue>
              )}
            </InfoSection>
            <InfoSection>
              <InfoLabel>Location</InfoLabel>
              {editingSection === 'personal' ? (
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                />
              ) : (
                <InfoValue>{displayData.location}</InfoValue>
              )}
            </InfoSection>
            <InfoSection>
              <InfoLabel>Website</InfoLabel>
              {editingSection === 'personal' ? (
                <Input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              ) : displayData.website && displayData.website !== 'N/A' ? (
                <InfoValue>
                  <a
                    href={displayData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#4A90E2',
                      textDecoration: 'none',
                    }}
                  >
                    {displayData.website}
                  </a>
                </InfoValue>
              ) : (
                <InfoValue>N/A</InfoValue>
              )}
            </InfoSection>
          </CardBody>
        </InfoCard>

        <InfoCard>
          <CardHeader>
            <CardHeaderWithButton>
              <CardTitle>Account Information</CardTitle>
              {editingSection === 'account' ? (
                <SectionButtonGroup>
                  <Button 
                    size="sm" 
                    onClick={() => handleSave('account')} 
                    disabled={profileLoading}
                  >
                    {profileLoading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleCancel('account')} 
                    disabled={profileLoading}
                  >
                    Cancel
                  </Button>
                </SectionButtonGroup>
              ) : (
                <Button size="sm" onClick={() => handleEditClick('account')}>
                  Edit
                </Button>
              )}
            </CardHeaderWithButton>
          </CardHeader>
          <CardBody>
            <InfoSection>
              <InfoLabel>Role</InfoLabel>
              {editingSection === 'account' ? (
                <Input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Enter your role"
                />
              ) : (
                <InfoValue>{displayData.role}</InfoValue>
              )}
            </InfoSection>
            <InfoSection>
              <InfoLabel>Company</InfoLabel>
              {editingSection === 'account' ? (
                <Input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
              ) : (
                <InfoValue>{displayData.company}</InfoValue>
              )}
            </InfoSection>
            <InfoSection>
              <InfoLabel>Account Status</InfoLabel>
              <InfoValue>
                <span
                  style={{
                    color: '#50C878',
                    fontWeight: 600,
                  }}
                >
                  {displayData.accountStatus}
                </span>
              </InfoValue>
            </InfoSection>
            <InfoSection>
              <InfoLabel>Member Since</InfoLabel>
              <InfoValue>{displayData.joinDate}</InfoValue>
            </InfoSection>
            <InfoSection>
              <InfoLabel>Last Active</InfoLabel>
              <InfoValue>{displayData.lastActive}</InfoValue>
            </InfoSection>
          </CardBody>
        </InfoCard>
      </CardsGrid>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardBody>
          {tasksLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading statistics...
            </div>
          ) : (
            <StatsGrid>
              <StatItem>
                <StatValue>{displayData.totalTasks}</StatValue>
                <StatLabel>Total Tasks</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{displayData.completedTasks}</StatValue>
                <StatLabel>Completed</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{displayData.pendingTasks}</StatValue>
                <StatLabel>Pending</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>
                  {displayData.completionRate}%
                </StatValue>
                <StatLabel>Completion Rate</StatLabel>
              </StatItem>
            </StatsGrid>
          )}
        </CardBody>
      </Card>

      <Divider />

      <Card>
        <CardHeader>
          <CardHeaderWithButton>
            <CardTitle>About</CardTitle>
            {editingSection === 'about' ? (
              <SectionButtonGroup>
                <Button 
                  size="sm" 
                  onClick={() => handleSave('about')} 
                  disabled={profileLoading}
                >
                  {profileLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleCancel('about')} 
                  disabled={profileLoading}
                >
                  Cancel
                </Button>
              </SectionButtonGroup>
            ) : (
              <Button size="sm" onClick={() => handleEditClick('about')}>
                Edit
              </Button>
            )}
          </CardHeaderWithButton>
        </CardHeader>
        <CardBody>
          <InfoSection>
            <InfoLabel>Bio</InfoLabel>
            {editingSection === 'about' ? (
              <TextArea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                style={{ minHeight: '100px' }}
              />
            ) : (
              <InfoValue style={{ lineHeight: '1.8', marginTop: '8px' }}>
                {displayData.bio || 'No bio available'}
              </InfoValue>
            )}
          </InfoSection>
        </CardBody>
      </Card>
    </UserDetailsContainer>
  );
};

