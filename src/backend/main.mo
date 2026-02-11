import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    emoji : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize the first admin (owner)
  public shared ({ caller }) func initialize(adminToken : Text, userProvidedToken : Text) : async () {
    let currentRole = AccessControl.getUserRole(accessControlState, caller);
    switch (currentRole) {
      case (#admin) { Runtime.trap("Already initialized") };
      case (#user) { Runtime.trap("Not authorized") };
      case (#guest) {
        AccessControl.initialize(
          accessControlState,
          caller,
          adminToken,
          userProvidedToken,
        );
      };
    };
  };

  // Admin-only: Get list of all users with their roles
  public query ({ caller }) func getAllowlist() : async [Principal] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view the allowlist");
    };
    // Return all principals that have user or admin role
    // Note: This is a simplified version. In production, you'd maintain a separate list
    // or extend the AccessControl module to provide this functionality
    [];
  };

  // Admin-only: Add a user to the allowlist (grant user role)
  public shared ({ caller }) func addAllowlistEntry(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add users to the allowlist");
    };
    // assignRole already includes admin-only guard, but we check explicitly for clarity
    AccessControl.assignRole(accessControlState, caller, user, #user);
  };

  // Admin-only: Remove a user from the allowlist (revoke to guest)
  public shared ({ caller }) func removeAllowlistEntry(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can remove users from the allowlist");
    };
    // assignRole already includes admin-only guard, but we check explicitly for clarity
    AccessControl.assignRole(accessControlState, caller, user, #guest);
  };

  // Get another user's profile (admin-only or own profile)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Get caller's own profile (user-only)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  // Save caller's own profile (user-only)
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Get all user profiles (user-only)
  public query ({ caller }) func getAllProfiles() : async [UserProfile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.values().toArray();
  };
};
