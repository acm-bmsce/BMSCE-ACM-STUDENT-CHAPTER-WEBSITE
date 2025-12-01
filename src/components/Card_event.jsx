import { Calendar, MapPin, Users } from 'lucide-react';
import { CardBody, CardContainer, CardItem } from "./ui/3d-card"

export const EventCard = ({ event, onClick }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <CardContainer
            className="group bg-event-card border border-event-card-border rounded-xl p-5 
                 shadow-card hover:shadow-elevated transition-all duration-300 
                 cursor-pointer hover:scale-105 hover:border-primary/50 
                 w-[400px] h-[500px] flex-shrink-0"
            onClick={onClick}
        >
            <CardBody>
                {/* Event Image */}
                <CardItem translateZ="80" className="w-full mt-4">
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-48 object-cover transition-transform duration-300 
                     group-hover:scale-110"
                        />
                    </div>
                </CardItem>
                {/* Event Info */}
                <div className="space-y-3">
                    <CardItem translateY={5} translateZ={60}>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary 
                       transition-colors duration-300 line-clamp-2">
                            {event.title}
                        </h3>

                        <p className="text-muted-foreground text-sm line-clamp-2">
                            {event.description} <br />
                            {event.outcomes}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span className='text-green-600'>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{event.attendees} participants</span>
                            </div>
                            <div className="text-primary font-medium text-sm group-hover:text-primary-glow 
                          transition-colors duration-300">
                                View Details →
                            </div>
                        </div>
                    </CardItem>
                </div>

            </CardBody>
        </CardContainer>
    );
};