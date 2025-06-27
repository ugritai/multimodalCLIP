
import { ChartContainer, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts';

function generateColors(n: number): string[] {
  const colors: string[] = [];
  const saturation = 85;
  const lightness = 40;

  for (let i = 0; i < n; i++) {
    const hue = Math.round((360 / n) * i); 
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
}

const chartConfig = {
  } satisfies ChartConfig

export function ReportCharts({classes, chartData} : {classes:string[],chartData:any}){
    const colors = generateColors(classes.length);
    return (
        <div>
            <ChartContainer config={chartConfig}  className='min-h-[200px]  max-h-[33vh]'>
                <BarChart accessibilityLayer data={chartData}>
                    <YAxis domain={[0,1]}/>
                    <XAxis
                        dataKey="label"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <Tooltip/>
                    <Legend/>
                    {classes.map((value, index) =>{
                        console.log(value);
                        return <Bar dataKey={value} fill={colors[index]} radius={4} />
                    })}
                </BarChart>
            </ChartContainer>
        </div>
    )
}