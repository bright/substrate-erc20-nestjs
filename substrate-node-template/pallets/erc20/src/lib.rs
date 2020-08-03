#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
    decl_module, decl_storage, decl_event, decl_error, ensure, StorageMap
};
use frame_system::{self as system, ensure_signed};

pub trait Trait: system::Trait {
    /// The overarching event type.
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

// This pallet's events.
decl_event! {
    pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
        /// Token was initialized by user
		Initialized(AccountId),
        /// Tokens successfully transferred between users
        Transfer(AccountId, AccountId, u64), // (from, to, value)
		/// Allowance successfully created
        Approval(AccountId, AccountId, u64), // (from, to, value)
    }
}

// This pallet's errors.
decl_error! {
    pub enum Error for Module<T: Trait> {
        /// Attempted to initialize the token after it had already been initialized.
        AlreadyInitialized,
        /// Attempted to transfer more funds than were available
        InsufficientFunds,
		/// Attempted to transfer more funds than approved
        InsufficientApprovedFunds,
    }
}

// This pallet's storage items.
decl_storage! {
    trait Store for Module<T: Trait> as Erc20 {
        pub BalanceOf get(fn balance_of): map hasher(blake2_128_concat) T::AccountId => u64;
		pub TotalSupply get(fn total_supply): u64 = 0;
		Init get(fn is_init): bool;
		pub Allowance get(fn allowance): map hasher(blake2_128_concat) (T::AccountId, T::AccountId) => u64;
    }
}

// The pallet's dispatchable functions.
decl_module! {
    /// The module declaration.
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        // Initializing errors
        // this includes information about your errors in the node's metadata.
        // it is needed only if you are using errors in your pallet
        type Error = Error<T>;

        // A default function for depositing events
        fn deposit_event() = default;

		#[weight = 10_000]
        pub fn init(origin, total_supply: u64) {
			let sender = ensure_signed(origin)?;
			ensure!(!Self::is_init(), <Error<T>>::AlreadyInitialized);

			TotalSupply::put(total_supply);
			<BalanceOf<T>>::insert(sender, total_supply);

			Init::put(true);
		}

		#[weight = 10_000]
        pub fn transfer(_origin, to: T::AccountId, value: u64) {
			let sender = ensure_signed(_origin)?;
			
			// get the balance values
			let from_balance = Self::balance_of(&sender);
			let to_balance = Self::balance_of(&to);

			// Calculate new balances
			let updated_from_balance = from_balance.checked_sub(value).ok_or(<Error<T>>::InsufficientFunds)?;
			let updated_to_balance = to_balance.checked_add(value).expect("Entire supply fits in u64; qed");

			// Write new balances to storage
			<BalanceOf<T>>::insert(&sender, updated_from_balance);
			<BalanceOf<T>>::insert(&to, updated_to_balance);

			Self::deposit_event(RawEvent::Transfer(sender, to, value));
		}

		#[weight = 10_000]
        pub fn approve(_origin, spender: T::AccountId, value: u64) {
			let owner = ensure_signed(_origin)?;
			
			<Allowance<T>>::insert((&owner, &spender), value);

			Self::deposit_event(RawEvent::Approval(owner, spender, value));
		}

		#[weight = 10_000]
        pub fn transfer_from(_origin, owner: T::AccountId, to: T::AccountId, value: u64) {
			let spender = ensure_signed(_origin)?;

			// get the balance values
			let owner_balance = Self::balance_of(&owner);
			let to_balance = Self::balance_of(&to);

			// get the allowance value
			let approved_balance = Self::allowance((&owner, &spender));

			// Calculate new balances
			let updated_approved_balance = approved_balance.checked_sub(value).ok_or(<Error<T>>::InsufficientApprovedFunds)?;
			let updated_owner_balance = owner_balance.checked_sub(value).ok_or(<Error<T>>::InsufficientFunds)?;
			let updated_to_balance = to_balance.checked_add(value).expect("Entire supply fits in u64; qed");

			// Write new balances to storage
			<BalanceOf<T>>::insert(&owner, updated_owner_balance);
			<BalanceOf<T>>::insert(&to, updated_to_balance);
			
			// Write new allowance to storage
			<Allowance<T>>::insert((&owner, &spender), updated_approved_balance);

			Self::deposit_event(RawEvent::Transfer(owner, to, value));
		}
    }
}