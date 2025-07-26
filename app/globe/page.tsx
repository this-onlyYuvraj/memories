"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'
import Globe, {GlobeMethods} from 'react-globe.gl'
import { toast } from 'sonner';

interface transformedLocation{
    lat:number;
    lng:number;
    name:string;
    country:string
}

export default function GlobePage(){
    const globeRef = useRef<GlobeMethods | undefined>(undefined)
    const [memoryLocation, setMemoryLocation] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState(true)
    const [location, setLocation] = useState<transformedLocation[]>([])
    useEffect(()=>{
        const fetchLocations = async()=>{
            try {
                const response = await fetch('/api/memories');

                if (response.status === 401) {
                    return toast.error("Please Login First")
                    
                }
                if (!response.ok) {
                    const errorText = await response.text(); // fallback if not JSON
                    throw new Error(errorText || 'Something went wrong');
                }

                const data = await response.json();
                setLocation(data);

                const countries = new Set<string>(data.map((loc: transformedLocation) => loc.country));
                setMemoryLocation(countries);
            } catch (error: any) {
                toast.error(error.message || 'Failed to fetch memories');
            } finally {
                setIsLoading(false);
            }
        }
        fetchLocations()
    }, [])
    useEffect(()=>{
        if(globeRef.current){
            globeRef.current.controls().autoRotate = true
            globeRef.current.controls().autoRotateSpeed = 0.9
        }
    })
    return(
        <div className="min-h-screen bg-gradient-to-br from-[#fcc5c0] to-[#fa9fb5] text-pink-900 px-4 ">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-center text-5xl font-bold mb-12" style={{ fontFamily: "vamos, sans-serif" }}>Globe</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 bg-[#fa9fb5] rounded-xl shadow-lg overflow-hidden">
                            <div className=" p-6">
                                <h2 className="text-2xl font-semibold  text-pink-800 mb-4">See where your memories have been...</h2>
                                <div className="h-full w-full relative">
                                    {isLoading? (
                                        <div className='flex justify-center items-center h-4'>
                                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#fcc5c0]'></div>
                                        </div>
                                    ) : (<Globe ref={globeRef}
                                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                                        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                                        backgroundColor="rgba(0,0,0,0)"
                                        pointColor={() => "#FF5733"}
                                        pointLabel="name"
                                        pointsData={location}
                                        pointRadius={0.5}
                                        pointAltitude={0.1}
                                        pointsMerge={true}
                                        width={800}
                                        height={600}
                                    />)}
                                </div>
                            </div>
                        </div>
                        <div className='lg:col-span-1'>
                            <Card className='sticky top-8 bg-[#fa9fb5]'>
                                <CardHeader>
                                    <CardTitle className=' text-pink-800 font-extrabold'>
                                        Memory Location
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isLoading? (
                                        <div className='flex justify-center items-center h-4'>
                                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#fcc5c0]'></div>
                                        </div>
                                    ) : (
                                        <div className=' space-y-4'>
                                            <div className=' p-4 rounded-lg'>
                                                <p className='text-sm text-[#7a0177] font-medium'>You have <span className='font-bold'>{memoryLocation.size}</span> Unique Memory Location.</p>
                                            
                                            </div>
                                            <div className='space-y-2 max-h-[500px] overflow-y-auto pr-2'>
                                                {Array.from(memoryLocation).sort().map((country, key)=>(
                                                    <div key={key} className='flex  text-pink-800 items-center gap-2 p-3 bg-pink-100 rounded-lg hover:bg-pink-500 hover:text-pink-50 transition-colors border border-pink-300' >
                                                        <MapPin className='h-4 w-4 '/>
                                                        <span className='font-medium'>{country}</span>
                                                    </div>
                                                ))} 
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}