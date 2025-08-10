import PageLoader from '../components/PageLoader'
import useUser from '../hooks/useUser'
import { useListings } from '../hooks/useListings';
import ListingCard from '../components/ListingCard';

const Browse = () => {

    const { user } = useUser();
    const isAuthenticatedUser = Boolean(user);

    const { isLoading, listings:allListings } = useListings();
    const listings=isAuthenticatedUser?allListings:allListings.slice(0,5);

    if (isLoading) return <PageLoader />;
    return (
        <div>
            <h1>Browse Page</h1>
            {
                listings.map((listing, idx)=>{
                    return <ListingCard listing={listing} key={idx}/>
                })
            }
        </div>
    )
}

export default Browse
