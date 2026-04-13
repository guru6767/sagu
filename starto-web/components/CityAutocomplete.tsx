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

    const fetchCities = async (searchQuery: string) => {
        setLoading(true);
        try {
            const res = await fetch(`https://api.teleport.org/api/cities/?search=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            const items = data._embedded?.["city:search-results"] || [];
            setSuggestions(items);
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
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
                <div className="absolute z-50 w-full mt-1 bg-black border border-white/10 rounded-lg shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                    {loading ? (
                        <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
                    ) : suggestions.length > 0 ? (
                        <ul className="py-1">
                            {suggestions.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelect(item.matching_full_name)}
                                    className="px-4 py-3 cursor-pointer hover:bg-white/10 flex items-center gap-3 text-sm text-gray-300 transition-colors border-b border-white/[0.05] last:border-0"
                                >
                                    <MapPin className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                    <span>{item.matching_full_name}</span>
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
