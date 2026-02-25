import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Search } from 'lucide-react';
import type { InstructorProfile } from '../../backend';

interface InstructorListProps {
  instructors: InstructorProfile[];
  onView: (instructor: InstructorProfile) => void;
}

export function InstructorList({ instructors, onView }: InstructorListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredInstructors.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">
            No instructors found
          </div>
        ) : (
          filteredInstructors.map((instructor) => {
            const initials = instructor.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <Card key={instructor.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onView(instructor)}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{instructor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{instructor.department}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{instructor.officeLocation || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <a href={`mailto:${instructor.email}`} className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                      {instructor.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <a href={`tel:${instructor.phone}`} className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                      {instructor.phone}
                    </a>
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={(e) => { e.stopPropagation(); onView(instructor); }}>
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
