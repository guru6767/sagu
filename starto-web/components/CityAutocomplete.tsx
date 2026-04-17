"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";

interface CityAutocompleteProps {
    value: string;
    onChange: (city: string) => void;
}

export default function CityAutocomplete({ value, onChange }: CityAutocompleteProps) {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const autocompleteService = useRef<any>(null);

    // Sync with parent value
    useEffect(() => {
        if (value !== query && (value || query)) {
            setQuery(value || "");
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            // Only search if query is 2+ chars and doesn't match current selection
            if (query && query.length > 1 && query !== value && isOpen) {
                fetchCities(query);
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, value, isOpen]);

    const fetchCities = (searchQuery: string) => {
        setLoading(true);
        if (!autocompleteService.current && typeof window !== "undefined" && (window as any).google?.maps?.places) {
            autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
        }

        if (autocompleteService.current) {
            autocompleteService.current.getPlacePredictions(
                { input: searchQuery, types: ['(cities)'] },
                (predictions: any[], status: string) => {
                    setLoading(false);
                    if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && predictions) {
                        setSuggestions(predictions);
                    } else {
                        setSuggestions([]);
                    }
                }
            );
        } else {
            setLoading(false);
        }
    };

    const handleSelect = (cityName: string) => {
        setQuery(cityName);
        onChange(cityName);
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setIsOpen(true);
        // Ensure parent is updated immediately so the field isn't considered empty
        onChange(val);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search for a city..."
                    autoComplete="off"
                    required
                    className="w-full mt-2 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-white/40 focus:bg-white/10 transition-colors"
                />
            </div>

            {isOpen && query && query.length > 1 && (
                <div className="absolute z-50 w-full mt-1 bg-[#202124] border border-white/10 rounded-lg shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                    {loading ? (
                        <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
                    ) : suggestions.length > 0 ? (
                        <ul className="py-1">
                            {suggestions.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelect(item.description)}
                                    className="px-4 py-3 cursor-pointer hover:bg-white/10 flex flex-col justify-center gap-1 text-sm border-b border-white/[0.05] last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="text-gray-200 font-medium">{item.structured_formatting?.main_text || item.description}</span>
                                            {item.structured_formatting?.secondary_text && (
                                                <span className="text-xs text-gray-400">{item.structured_formatting.secondary_text}</span>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">No cities found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
