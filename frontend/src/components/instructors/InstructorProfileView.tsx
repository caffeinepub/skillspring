import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Clock, Building2, Pencil } from 'lucide-react';
import type { InstructorProfile } from '../../backend';

interface InstructorProfileViewProps {
  profile: InstructorProfile;
  onEdit: () => void;
  canEdit: boolean;
}

export function InstructorProfileView({ profile, onEdit, canEdit }: InstructorProfileViewProps) {
  const initials = profile.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-serif font-bold">{profile.name}</h3>
              <p className="text-muted-foreground">{profile.department}</p>
              <p className="text-sm text-muted-foreground">ID: {profile.id}</p>
            </div>
            {canEdit && (
              <Button onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      {profile.bio && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Professional Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{profile.bio}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <a href={`mailto:${profile.email}`} className="font-medium text-primary hover:underline flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {profile.email}
              </a>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <a href={`tel:${profile.phone}`} className="font-medium text-primary hover:underline flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {profile.phone}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Office Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Office Hours</p>
              <p className="font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {profile.officeHours || 'By appointment'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Office Location</p>
              <p className="font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {profile.officeLocation || 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Department
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{profile.department}</p>
        </CardContent>
      </Card>
    </div>
  );
}
